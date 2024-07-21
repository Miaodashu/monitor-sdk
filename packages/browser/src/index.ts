import { Core, Queue, Stack } from '@monitor-sdk/core';
import { BrowserOptionType, BrowserReportPayloadDataType } from './types';
import { IAnyObject, BrowserReportType, PlatformTypes, BaseOptionsType } from '@monitor-sdk/types';
import { beacon, generateUUID, get, imgRequest, post, DeviceInfo } from '@monitor-sdk/utils';
import { nextTick } from './lib/nextTick';
import jsErrorPlugin from './plugins/jsErrorPlugin';
import promiseErrorPlugin from './plugins/promiseErrorPlugin';
import lifecyclePlugin from './plugins/lifecyclePlugin';

class BrowserClient extends Core<BrowserOptionType> {
    private readonly queue: Queue<BaseOptionsType>;
    protected sessionID: string;
    protected userID: string;
    private timer: any;
    private task: Stack;
    private batchSize: number;
    private interval: number;
    private isReporting: boolean;
    constructor(options) {
        super(options);
        // 初始化队列, 用于储存上报数据结构, 主要用简易的队列数据， 简易的还原行为追踪
        this.queue = new Queue(options);
        // 上报数据， 用于存储上报数据， 选择适合的上报策略，批量上报
        this.task = new Stack();
        // 缓存上报数据的条数，默认五条
        this.batchSize = options.batchSize || 5;
        // 缓存上报数据的间隔，默认三秒
        this.interval = options.interval || 3000;

        this.isReporting = false; // 上报状态

        this.startPeriodicReporting();
        window.addEventListener(
            'visibilitychange',
            (event) => {
                if (document.visibilityState === 'hidden') {
                    this.isReporting = false;
                    this.transfromCatcheData();
                    this.timer = null;
                    this.task.clear();
                }
            },
            true
        );
        window.addEventListener(
            'beforeunload',
            () => {
                this.isReporting = false;
                this.transfromCatcheData();
                this.timer = null;
                this.task.clear();
            },
            true
        );
    }
    /**
     * 发送报告
     *
     * @param url - 上报URL
     * @param data - 上报数据
     * @param type - 上报类型，默认为BEACON
     */
    report(data: IAnyObject, isImmediate: boolean = false, type: BrowserReportType = BrowserReportType.BEACON) {
        const { uploadUrl: url } = this.context;
        if (!url) {
            this.log(`上报URL 不能为空！！！`);
            return;
        }
        if (isImmediate) {
            this.baseReport(url, data, type);
            return;
        }

        this.nextTick(this.lazyReportCache, this, { ...data }, type);
    }

    // 开始定期上报
    startPeriodicReporting() {
        if (!this.timer && !this.isReporting) {
            this.timer = setTimeout(() => {
                this.transfromCatcheData();
            }, this.interval);
        }
    }

    // 处理缓存数据
    transfromCatcheData() {
        if (this.task.size() && !this.isReporting) {
            const datas = unique(this.task.getStacks() || [], '_uuid');
            this.baseReport(this.context.uploadUrl, datas).then(() => {
                this.task.clear();
            });
        }
    }

    lazyReportCache(data: IAnyObject, type: BrowserReportType, timeout = 3000) {
        this.task.push(data);
        if (this.task.size() >= this.batchSize) {
            this.transfromCatcheData();
        }
    }

    /**
     * 基础的上报方法
     *
     * @param url - 上报URL
     * @param data - 上报数据
     * @param type - 上报类型，默认为BEACON
     */
    baseReport(url: string, data: IAnyObject | IAnyObject[], type: BrowserReportType = BrowserReportType.BEACON) {
        // promise控制下是否清除缓存数据。上报成功后 再清除，否则不处理
        return new Promise(async (resolve, reject) => {
            if (!data || !data.length) {
                return resolve(true);
            }
            this.isReporting = true;
            if (type === BrowserReportType.BEACON && !!navigator.sendBeacon) {
                const result = await beacon(url, data);
                this.isReporting = false;
                return resolve(result);
            }

            if (type === BrowserReportType.POST) {
                return post(url, data)
                    .then(() => {
                        return resolve(true);
                    })
                    .catch((error) => {
                        return reject(error);
                    })
                    .finally(() => {
                        this.isReporting = false;
                    });
            }

            if (type === BrowserReportType.IMG || !navigator.sendBeacon) {
                await imgRequest(url, data);
                this.isReporting = false;
                return resolve(true);
            }

            return get(url, data)
                .then(() => {
                    return resolve(true);
                })
                .catch((error) => {
                    return reject(error);
                })
                .finally(() => {
                    this.isReporting = false;
                });
        });
    }

    nextTick(cb: Function, ctx: Object, ...args: any[]) {
        return nextTick(cb, ctx, ...args);
    }

    // 处理浏览器端的上报数据
    transform(data: IAnyObject): BrowserReportPayloadDataType {
        if (!data) {
            return null;
        }
        const { title } = document;
        const { href } = window.location;
        let deviceInfo = DeviceInfo.getDeviceInfo();
        let deviceInfoStr = JSON.stringify(deviceInfo);
        // 在这里一会进行 公共部分的数据处理
        return {
            session_id: this.sessionID,
            user_id: this.userID,
            page_title: title,
            path: href,
            deviceInfo: deviceInfoStr,
            ...data
        };
    }
}

const init = (options: BrowserOptionType) => {
    try {
        const client = new BrowserClient(options);
        const { plugins = [] } = options;
        client.use([jsErrorPlugin, promiseErrorPlugin.call(client), lifecyclePlugin.call(client, options), ...plugins]);
        return client;
    } catch (error) {
        console.debug('===@monitor-sdk error===', error);
        return {};
    }
};

// 数组对象根据某个key去重
function unique(arr: Array<any>, key: string) {
    let map = new Map();
    return arr.filter((item) => !map.has(item[key]) && map.set(item[key], 1));
}

export default init;
