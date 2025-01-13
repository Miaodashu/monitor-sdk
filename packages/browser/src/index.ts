import { Core, Queue } from '@monitor-sdk/core';
import { BrowserOptionType, BrowserReportPayloadDataType } from './types';
import { IAnyObject, BrowserReportType, PlatformTypes, BaseOptionsType } from '@monitor-sdk/types';
import { beacon, generateUUID, get, imgRequest, post, DeviceInfo } from '@monitor-sdk/utils';
import { nextTick } from './lib/nextTick';
import jsErrorPlugin from './plugins/jsErrorPlugin';
import promiseErrorPlugin from './plugins/promiseErrorPlugin';
import lifecyclePlugin from './plugins/lifecyclePlugin';
import { getExtendsInfo, getStoreUserId } from './lib/utils';
class BrowserClient extends Core<BrowserOptionType> {
    private readonly queue: Queue<BaseOptionsType>;
    protected sessionID: string;
    protected userID: string;
    public browserOptions: BrowserOptionType;
    constructor(options) {
        super(options);
        this.browserOptions = options;
        this.initBrowserOptions(options);
        // 初始化队列, 用于储存上报数据结构
        this.queue = new Queue(options);
    }
    initBrowserOptions(options) {
        const { enabledBasePlugins = true, enabledDeviceInfo = true } = options;
        this.browserOptions = { ...options, enabledBasePlugins, enabledDeviceInfo }
    }
    // 初始化应用， 后期看是否需要， 因为许多参数都是传进来的， 没必要初始化， 先留个口
    async initApp() {
        const { uploadUrl } = this.context;
        const params = {
            id: generateUUID(),
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
        this.log(data);
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
        if (!data) {
            return null;
        }
        const { title } = document;
        const { href } = window.location;
        const { userIdentify = {}, enabledDeviceInfo } = this.browserOptions;
        const { name: userPath, postion: userPosi } = userIdentify;
        const user_id = getStoreUserId(userIdentify) || '';
        if (userPath && userPosi && user_id) {
            this.userID = user_id;
        }
        // 在这里一会进行 公共部分的数据处理
        let result:BrowserReportPayloadDataType = {
            session_id: this.sessionID,
            user_id: this.userID,
            page_title: title,
            path: href,
            extendInfo: getExtendsInfo(this.context?.extendInfo || {}),
            ...data
        };
        if (enabledDeviceInfo) {
            let deviceInfo = DeviceInfo.getDeviceInfo();
            let deviceInfoStr = JSON.stringify(deviceInfo);
            result.deviceInfo = deviceInfoStr
        }
        return result;
    }
}

const init = (options: BrowserOptionType) => {
    try {
        const client = new BrowserClient(options);
        const { plugins = [] } = options;
        const { enabledBasePlugins = true } = client.browserOptions;
        let pluginArr = []
        if (enabledBasePlugins) {
            pluginArr = [jsErrorPlugin, promiseErrorPlugin.call(client)]
        }
        client.use([lifecyclePlugin.call(client, options), ...pluginArr, ...plugins]);
        // client.use([jsErrorPlugin, promiseErrorPlugin.call(client), lifecyclePlugin.call(client, options), ...plugins]);
    } catch (error) {
        console.debug('===@monitor-sdk error===', error);
    }
    
};

export default init;
