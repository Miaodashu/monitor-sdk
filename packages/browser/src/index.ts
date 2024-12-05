import { Core, Queue } from '@tc-track/core';
import { BrowserOptionType, BrowserReportPayloadDataType } from './types';
import { IAnyObject, BaseOptionsType, ReportDataType } from '@tc-track/types';
import { nextTick } from './lib/nextTick';
import jsErrorPlugin from './plugins/jsErrorPlugin';
import promiseErrorPlugin from './plugins/promiseErrorPlugin';
import lifecyclePlugin from './plugins/lifecyclePlugin';
import { getExtendsInfo, getStoreUserId } from './lib/utils';

class BrowserClient extends Core<BrowserOptionType> {
    private readonly queue: Queue<BaseOptionsType>;
    protected sessionID: string;
    protected userID: string;
    protected coreOptions: BrowserOptionType;
    constructor(options) {
        super(options);
        this.coreOptions = options;
        // 初始化队列, 用于储存上报数据结构
        this.queue = new Queue(options);
    }
    // 初始化应用，
    initAPP() {
        return new Promise((resolve) => {
            let params = this.context.dsn || {}; //默认值
            // @ts-ignore
            window._tcq = window._tcq || [];
            // @ts-ignore
            window._timediff = -1;
            // @ts-ignore
            if (typeof window._tcopentime != 'undefined') {
                // @ts-ignore
                window._timediff = new Date().getTime() - window._tcopentime;
            }
            window._tcq.push(['_openid', params._openid]); //必填
            window._tcq.push(['_unionid', params._unionid]); //必填
            window._tcq.push(['_userId', params._userId]); //必填，传入访问者中登录的会员ID，未登录的为0，不同平台的读取方法不同，项目自己读取会员ID
            window._tcq.push(['_vrcode', params._vrcode]); //产品号解释见说明，最后一位默认为0，写成其他的统计不到，此条代码最重要
            resolve(true);
        });
    }
    /**
     * 发送报告
     *
     * @param url - 上报URL
     * @param data - 上报数据
     * @param type - 上报类型，默认为BEACON
     */
    report(data: ReportDataType<any>) {
        this.log(data);
        this.appendTrack(data.type, data.data.sub_type, '', encodeURIComponent(JSON.stringify(data)));
    }

    appendTrack(category = '', action = '', label = '', value = '', eventid = '') {
        try {
            label = label || '';
            if (!window._tcTraObj) {
                setTimeout(() => {
                    window._tcTraObj && window._tcTraObj._tcTrackEventNew(category, action, label, value, eventid);
                }, 1000);
                return;
            }
            window._tcTraObj && window._tcTraObj._tcTrackEventNew(category, action, label, value, eventid);
        } catch (err) {
            console.log(err);
        }
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
        // let deviceInfo = DeviceInfo.getDeviceInfo();
        // let deviceInfoStr = JSON.stringify(deviceInfo);
        // 在这里一会进行 公共部分的数据处理
        const { userIdentify = {} } = this.coreOptions;
        const { name: userPath, postion: userPosi } = userIdentify;
        const user_id = getStoreUserId(userIdentify) || '';
        if (userPath && userPosi && user_id) {
            this.userID = user_id;
        }
        return {
            session_id: this.sessionID,
            user_id: this.userID,
            page_title: title,
            path: href,
            appInfo: this.context?.app,
            extendInfo: getExtendsInfo(this.context?.extendInfo || {}),
            // deviceInfo: deviceInfoStr,
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
        console.debug('===@tc-track error===', error);
    }
};

export default init;
