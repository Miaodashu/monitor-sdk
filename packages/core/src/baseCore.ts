import { BaseOptionsType, CoreContextType } from './types/index';
import { IAnyObject, Recordable } from './types/common';
import { ConsoleTypes } from './types/constant';
import { hasConsole } from '@monitor-sdk/utils';
import { TAG } from './lib/globalConfig';
import { PubSub } from './lib/subscribe';
import { BasePluginType } from './types/plugin';
import { Queue } from './lib/queue';


export abstract class Core<OptionsType extends BaseOptionsType> {
    private readonly options: OptionsType;
    public context: CoreContextType;
    protected appID: string;
    // 任务队列, 先进先出
    protected readonly taskQueue: Queue;
    // 是否准备好, 做个开关判断, 当为true的时候 才能执行上报
    protected isReady: Boolean;

    constructor(options: OptionsType) {
        this.isReady = false;
        this.options = options;
        this.taskQueue = new Queue();
        this.bindOptions()
        this.initApp<string>().then(id => {
            if (id) {
                this.appID = id;
            }
            // 开始执行上报
            this.isReady = true;
            this.executeTaskQueue()
        })
    }

    // 引用插件
    use(plugins: BasePluginType[]) {
        let { uploadUrl, enabled } = this.context;
        const pubSub = new PubSub()
        plugins.forEach(plugin => {
            plugin.monitor.call(this, pubSub.publish(plugin.name))
            const callback = (...args: any[]) => {
                const pluginData = plugin.beforeReport?.apply(this, args)
                if (!pluginData) {
                    return
                }
                if (!enabled) {
                    return
                }
                if (!this.isReady) {
                    this.taskQueue.enqueue(pluginData)
                    return
                }
                this.nextTick(this.report, this, uploadUrl, { app_id: this.appID, ...pluginData } )
            }
            pubSub.subscribe(plugin.name, callback)
        });
    }

    /**
     * @description: 统一定义log方法 控制台输出
     * @param {any} message
     * @param {ConsoleTypes} type
     * @return {*} void
     */
    log(message: any, type: ConsoleTypes = ConsoleTypes.LOG): void {
        const { debuge } = this.context;
        if (!hasConsole() || !debuge) {
            return;
        }
        const fn = console[type] as (...data: any[]) => void;
        if (typeof fn !== 'function') {
            throw Error('console type 不被支持');
        }
        fn(TAG, message);
    }

    // 初始化配置项
    private bindOptions() {
        const { debuge = false, enabled = true, dsn, app } = this.options;
        if (!app || !dsn) {
            this.log('配置项: app || dsn 必须配置');
        }
        const { host, init, url = '' } = dsn;
        // 这里可以设置一些参数初始化得东西
        const uploadUrl = url; // 上传的地址
        this.context = {
            app,
            uploadUrl,
            debuge,
            enabled
        };
    }

    // 获取配置项
    getApplicationOption() {
        return this.options
    }

    // 执行任务队列
    executeTaskQueue() {
        while (this.taskQueue.isEmpty()) {
            let task = this.taskQueue.enqueue()
            this.nextTick(this.report, this, this.context.uploadUrl, {app_id: this.appID, ...task})
        }
    }

    // 注册/初始化应用
    abstract initApp<T>(): Promise<T>

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
     * @param {any} type 上报的方式[走接口还是图片], or 请求方式[get/post]  暂定
     * @return {*}
     */    
    abstract report(url: string, data: IAnyObject, type?: any): void

    // 抽象方法  处理各个端的数据    
    abstract transform(data: IAnyObject): IAnyObject

}
