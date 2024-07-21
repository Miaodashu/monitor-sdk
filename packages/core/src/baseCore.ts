import { IAnyObject, BaseOptionsType, CoreContextType, ConsoleTypes, BasePluginType } from '@monitor-sdk/types';
import { hasConsole } from '@monitor-sdk/utils';
import { TAG } from './lib/globalConfig';
import { PubSub } from './lib/subscribe';
import { Queue } from './lib/queue';

export abstract class Core<OptionsType extends BaseOptionsType> {
    private readonly options: OptionsType;
    public context: CoreContextType;
    protected appID: string;
    // 任务队列, 先进先出
    // protected readonly taskQueue: Queue<BaseOptionsType>;
    // 前期先用数组方便些, 后面改成队列
    protected readonly taskQueue: Array<IAnyObject>;
    // 是否准备好, 做个开关判断, 当为true的时候 才能执行上报
    protected isReady: Boolean;

    constructor(options: OptionsType) {
        this.isReady = false;
        this.options = options;
        this.taskQueue = [];
        this.bindOptions();
        // 开始执行上报
        this.isReady = true;
        this.executeTaskQueue();
    }


    // 引用插件
    use(plugins: BasePluginType[]) {
        let { uploadUrl, enabled } = this.context;
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
                    this.nextTick(this.report, this, { app_id: this.appID, ...datas });
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
        const { debuge = false, enabled = true, dsn } = this.options;
        if (!dsn) {
            this.log('配置项: dsn 必须配置');
        }
        const { reportUrl = '', projectId } = dsn;
        if (!projectId) {
            this.log('配置项: projectId 必须配置');
        }
        // 这里可以设置一些参数初始化得东西
        const uploadUrl = reportUrl; // 上传的地址
        this.appID = projectId;
        this.context = {
            uploadUrl,
            debuge,
            enabled
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
            this.nextTick(this.report, this, { app_id: this.appID, ...task });
        }
    }

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
     * @param {string} url 上报的接口地址
     * @param {IAnyObject} data 上报的数据
     * @param {boolean} isImmediate 是否立即上报
     * @param {any} type 上报的方式[走接口还是图片], or 请求方式[get/post]  暂定
     * @return {*}
     */
    abstract report(data: IAnyObject, isImmediate:boolean, type?: any): void;

    // 抽象方法  处理各个端的上报数据
    abstract transform(data: IAnyObject): IAnyObject;
}
