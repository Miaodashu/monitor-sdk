import { Core, Queue } from '@monitor-sdk/core';
import { BrowserOptionType, BrowserReportPayloadDataType } from './types';
import { IAnyObject, BrowserReportType, PlatformTypes, BaseOptionsType } from '@monitor-sdk/types';
import { beacon, generateUUID, get, imgRequest, post } from '@monitor-sdk/utils';
import { nextTick } from './lib/nextTick';
import jsErrorPlugin from './plugins/jsErrorPlugin';
import promiseErrorPlugin from './plugins/promiseErrorPlugin';
import lifecyclePlugin from './plugins/lifecyclePlugin';

class BrowserClient extends Core<BrowserOptionType> {
    private readonly queue: Queue<BaseOptionsType>;
    protected sessionID: string;
    constructor(options) {
        super(options);
        // 初始化队列, 用于储存上报数据结构
        this.queue = new Queue(options);
    }
    // 初始化应用， 后期看是否需要， 因为许多参数都是传进来的， 没必要初始化， 先留个口
    async initApp() {
        const { uploadUrl, app } = this.context;
        const params = {
            id: generateUUID(),
            ...app,
            createTime: new Date().getTime()
        };
        const { data = {} } = await this.report(uploadUrl, params, BrowserReportType.GET);
        return data.id;
    }
    /**
     * 发送报告
     *
     * @param url - 上报URL
     * @param data - 上报数据
     * @param type - 上报类型，默认为BEACON
     */
    report(url: string, data: IAnyObject, type: BrowserReportType = BrowserReportType.BEACON) {
        this.log('上报数据' + data);
        if (type === BrowserReportType.BEACON && !!navigator.sendBeacon) {
            beacon(url, data);
            return;
        }
        if (type === BrowserReportType.IMG || !navigator.sendBeacon) {
            imgRequest(url, data);
            return;
        }
        if (type === BrowserReportType.POST) {
            post(url, data);
            return;
        }
        return get(url, data);
    }

    nextTick(cb: Function, ctx: Object, ...args: any[]) {
        return nextTick(cb, ctx, ...args);
    }

    // 处理浏览器端的上报数据
    transform(data: IAnyObject): BrowserReportPayloadDataType {
        const { userAgent, language } = navigator;
        const { title } = document;
        const { href } = window.location;
        // 在这里一会进行 公共部分的数据处理， 后续把navigation和location里面的东西解析一下
        return {
            session_id: this.sessionID,
            page_title: title,
            language,
            path: href,
            user_agent: userAgent,
            platform: PlatformTypes.BROWSER,
            ...data
        };
    }
}

const init = (options: BrowserOptionType) => {
    const client = new BrowserClient(options);
    const { plugins = [] } = options;
    client.use([jsErrorPlugin, promiseErrorPlugin, lifecyclePlugin.call(client, options),  ...plugins]);
};

export default init;
