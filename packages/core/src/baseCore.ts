import { IAnyObject, BaseOptionsType, CoreContextType, ConsoleTypes, BasePluginType } from '@tc-track/types';
import { hasConsole } from '@tc-track/utils';
import { TAG } from './lib/globalConfig';
import { PubSub } from './lib/subscribe';

export abstract class Core<OptionsType extends BaseOptionsType> {
    private readonly options: OptionsType;
    public context: CoreContextType;
    protected appID: string;
    // 任务队列, 先进先出
    protected readonly taskQueue: Array<IAnyObject>;
    // 是否准备好, 做个开关判断, 当为true的时候 才能执行上报
    protected isReady: Boolean;

    constructor(options: OptionsType) {
        this.isReady = false;
        this.options = options;
        this.taskQueue = [];
        this.bindOptions();
        // 开始执行上报
        this.initAPP().then(() => {
            this.isReady = true;
            this.executeTaskQueue();
        });
    }


    // 引用插件
    use(plugins: BasePluginType[]) {
        let { enabled } = this.context;
        if (!enabled) {
            return;
        }
        const pubSub = new PubSub();
        plugins.forEach((plugin) => {
            if (!plugin) return;
            try {
                plugin.monitor.call(this, pubSub.publish.bind(pubSub, plugin.name));
                const callback = (...args: any[]) => {
                    const pluginData = plugin.beforeReport?.apply(this, args);

                    const datas = this.transform(pluginData);
                    if (!datas) {
                        return;
                    }
                    if (!enabled) {
                        return;
                    }
                    if (!this.isReady) {
                        this.taskQueue.push(datas);
                        return;
                    }
                    this.nextTick(this.report, this, { ...datas });
                };
                pubSub.subscribe(plugin.name, callback);
            } catch (error) {
                // throw Error('插件注册报错：' + error);
                this.log('插件注册报错：-----' + error + ((plugin && plugin.name) || '-未知插件'));
            }
        });
    }

    /**
     * @description: 统一定义log方法 sdk内部的所有log都会走这个方法
     * @param message - 打印信息
     * @param type - 打印类型，默认为LOG
     * @return {*} void
     */
    log(message: any, type: ConsoleTypes = ConsoleTypes.DEBUG): void {
        const { debuge } = this.options;
        if (!hasConsole() || !debuge) {
            return;
        }
        const fn = console[type] as (...data: any[]) => void;
        if (typeof fn !== 'function') {
            throw Error('console type 不被支持');
        }
        // fn(TAG + 'start');
        // console.group(TAG);
        fn(TAG, message);
        // fn(TAG + 'end');
        // console.groupEnd();
    }

    // 初始化配置项
    private bindOptions() {
        const { debuge = false, enabled = true, dsn, app } = this.options;
        if (!dsn) {
            this.log('配置项: dsn 必须配置');
        }
        // 这里可以设置一些参数初始化得东西
        this.context = {
            debuge,
            enabled,
            dsn,
            app
        };
    }

    // 获取配置项
    getApplicationOption() {
        return this.options;
    }

    // 执行任务队列
    executeTaskQueue() {
        while (this.taskQueue.length) {
            let task = this.taskQueue.shift();
            this.nextTick(this.report, this, { ...task });
        }
    }

    /**
     * 抽象方法，注册/初始化应用
     * @return {any} 
     */
    abstract initAPP(): Promise<any>;

    /**
     * @description: 抽象方法，nextTick
     * @param { Function } cb  回调函数
     * @param { Object }   ctx 上下文对象
     * @param { any[] }   args 剩余参数
     * @return {*}
     */
    abstract nextTick(cb: Function, ctx: Object, ...args: any[]): void;

    /**
     * @description: 上报 抽象方法  子类需要自己实现
     * @param {IAnyObject} data 上报的数据
     * @return {*}
     */
    abstract report(data: IAnyObject): void;

    // 抽象方法  处理各个端的上报数据
    abstract transform(data: IAnyObject): IAnyObject;
}
