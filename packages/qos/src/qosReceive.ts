import QosQueue from './lib/queue';
import { CallBack, CustomDate, LocalInfo } from './types';

class QosReceive {
    domainUrl: string;
    Authorization: string;
    receiverId: string;
    imServer: string;
    userKey: string;
    localStorageProxy: Storage;
    localStoreEnable: boolean;
    realTimeMsgQueue: QosQueue;
    lastSeq: null;
    lastSeqLocalKey: string;
    receivedMessages: Map<any, any>;
    localStoragePrefix: string;
    removeLocalMsgIntervalId: number;
    removeLocalMsgExcuting: boolean;
    REMOVE_LOCAL_MSG_INTERVAL: number;
    MESSAGES_VALID_TIME: number;
    waitAckImIds: Set<string>;
    ackIntervalId: number;
    ackExcuting: boolean;
    ACK_INTERVAL: number;
    idempotencyWhiteList: (...args: any[]) => boolean;
    idempotencyWhiteListLock: boolean;
    publishToBiz: CallBack;
    logger: any;
    module: string;
    sceneEvent: string;
    sendRecvLog: CallBack;
    platform: string | number;
    timeout: number;
    pullLostMsgsRetryNum: number;
    pullLostMsgsDelay: number;
    version: string;
    constructor(qosConfig) {
        this.domainUrl = qosConfig.domainUrl;
        this.Authorization = qosConfig.Authorization;
        // 用户信息
        // 用户Id
        this.receiverId = qosConfig.receiverId;
        // im服务版本
        this.imServer = qosConfig.imServer;
        this.userKey = `${this.imServer}::${this.receiverId}`;

        // 本地存储
        this.localStorageProxy = localStorage;
        this.localStoreEnable = qosConfig.localStoreEnable || true;

        // 实时消息队列
        this.realTimeMsgQueue = new QosQueue();

        // 最新的序号数据
        this.lastSeq = null;
        // 最新的序号数据本地存储key
        this.lastSeqLocalKey = `${this.userKey}_last_seq`;

        // 已接收消息处理
        /*
         * 时间间隔内接收到的需要QoS质量保证的消息指纹特征列表.
         *
         * key=消息包指纹码(String)，value=最近1次收到该包的时间戳（时间戳用于判定该包是否
         * 已失效时有用，收到重复包时用最近一次收到时间更新时间戳从而最大限度保证不重复） */
        this.receivedMessages = new Map();
        // 本地存储前缀，若前端支持localStorage，支持本地存储
        this.localStoragePrefix = `${this.userKey}_im_qos_`;
        // 定时清除已接收消息
        this.removeLocalMsgIntervalId = 0;
        this.removeLocalMsgExcuting = false;
        /* 检查线程执行间隔（单位：毫秒），默认1分钟 */
        this.REMOVE_LOCAL_MSG_INTERVAL = qosConfig.removeLocalMsgInterval || 60 * 1000; // 1分钟
        /* 一个消息放到在列表中（用于判定重复时使用）的生存时长（单位：毫秒），默认10分钟 */
        this.MESSAGES_VALID_TIME = qosConfig.msgValidTime || 10 * 60 * 1000; // 10分钟

        // ack处理
        this.waitAckImIds = new Set();
        this.ackIntervalId = 0;
        this.ackExcuting = false;
        this.ACK_INTERVAL = qosConfig.ackInterval || 1000; // 1秒

        // 业务幂等白名单方法
        this.idempotencyWhiteList = qosConfig.idempotencyWhiteList;
        this.idempotencyWhiteListLock = false;

        // 业务处理发布方法
        this.publishToBiz = qosConfig.publishToBiz;

        // 日志
        this.logger = qosConfig.logger || console;
        this.module = qosConfig.module || 'qos';
        this.sceneEvent = qosConfig.sceneEvent || 'qosReceive';
        this.sendRecvLog = qosConfig.sendRecvLog || console.log;
        this.platform = qosConfig.platform || '';

        // 接口超时时间
        this.timeout = qosConfig.timeout || 2000;

        // 漏消息拉取
        // 重试次数
        this.pullLostMsgsRetryNum = qosConfig.pullLostMsgsRetryNum || 3;
        // 重试间隔
        this.pullLostMsgsDelay = qosConfig.pullLostMsgsDelay || 100;

        // qos版本
        this.version = '1.0.1';
    }

    /**
     * 启动
     */
    startup() {
        // 如果本地存储列表不为空则尝试从本地存储恢复接收队列
        // 为了防止在网络状况不好的情况下，刷新页面，退出页面或重新进入时可能存在的重传，此时也能一定程序避免消息重复的可能
        this.recoveryFromLocalStorage();
        // this.startupRemoveLocalMsgJob();
        // this.startupAckJob();
    }

    /**
     * 从本地存储中恢复数据
     */
    recoveryFromLocalStorage() {
        if (!this.isSupportLocal()) {
            this.logWarn('当前客户端不支持本地存储');
            return;
        }

        if (this.localStorageProxy.length === 0) {
            return;
        }

        for (let i = 0; i < this.localStorageProxy.length; i++) {
            const key = this.localStorageProxy.key(i);

            if (key && key.startsWith(this.localStoragePrefix)) {
                this.recoveryReceivedMessages(key);
            }

            if (key && key === this.lastSeqLocalKey) {
                this.recoveryLastSeq();
            }
        }

        this.logInfo('从本地存储中恢复数据', {
            receivedMessages: [...this.receivedMessages.keys()],
            lastSeq: this.lastSeq,
            localStorageInfo: this.getLocalStorageInfo()
        });
    }

    recoveryReceivedMessages(key) {
        try {
            let imId = key.replace(this.localStoragePrefix, '');

            let receivedTimeStr = this.getLocal(key);
            if (!receivedTimeStr) {
                this.removeLocalMsg(imId);
                return;
            }

            let receivedTime = Number(receivedTimeStr) || 0;

            const delta = new Date().getTime() - receivedTime;
            if (delta >= this.MESSAGES_VALID_TIME) {
                // 该消息包超过了生命时长，去掉
                this.removeLocalMsg(imId);
            } else {
                // 有效的数据，放入receivedMessages
                this.receivedMessages.set(imId, receivedTime);
            }
        } catch (e) {
            this.logWarn('从本地恢复已接收消息异常', { key }, e);
        }
    }

    /**
     * 恢复lastSeq
     */
    recoveryLastSeq() {
        let item = this.getLocal(this.lastSeqLocalKey);
        try {
            if (!item) {
                this.removeLocal(this.lastSeqLocalKey);
                this.lastSeq = null;
                return;
            }

            this.lastSeq = JSON.parse(item);
            this.logInfo('从本地恢复lastSeq', { key: this.lastSeqLocalKey, item });
        } catch (e) {
            this.logWarn('从本地恢复lastSeq异常', { key: this.lastSeqLocalKey, item }, e);
            this.removeLocal(this.lastSeqLocalKey);
            this.lastSeq = null;
        }
    }

    /**
     * 获取本地存储信息
     * @returns {{}|{msg: string}}
     */
    getLocalStorageInfo() {
        if (!this.isSupportLocal()) {
            return { msg: '不支持本地存储' };
        }

        let info: LocalInfo;

        try {
            info.localStorageSize = this.localStorageProxy.length || 0;
            info.receivedMessagesSize = this.receivedMessages.size || 0;

            let localReceivedMessagesSize = 0;
            let localReceivedMessagesUsedBytes = 0;
            let localLastSeqSize = 0;
            let localLastSeqUsedBytes = 0;
            let usedBytes = 0;
            let maxBytes = 0;
            let maxBytesKey = '';

            for (let i = 0; i < this.localStorageProxy.length; i++) {
                const key = this.localStorageProxy.key(i);

                // key+value 占用的字节
                let b = key.length;
                let item = this.localStorageProxy.getItem(key);
                if (item) {
                    b += item.length;
                }

                // 收集最大占用的key
                if (b > maxBytes) {
                    maxBytes = b;
                    maxBytesKey = key;
                }

                // 总字节
                usedBytes += b;

                if (key.indexOf('_im_qos_') > -1) {
                    localReceivedMessagesSize += 1;
                    localReceivedMessagesUsedBytes += b;
                }

                if (key.indexOf('_last_seq') > -1) {
                    localLastSeqSize += 1;
                    localLastSeqUsedBytes += b;
                }
            }

            info.localReceivedMessagesSize = localReceivedMessagesSize;
            info.localReceivedMessagesUsedBytes = localReceivedMessagesUsedBytes;
            info.localLastSeqSize = localLastSeqSize;
            info.localLastSeqUsedBytes = localLastSeqUsedBytes;
            info.usedBytes = usedBytes;

            let qosUsedRate = 0;
            if (usedBytes > 0) {
                qosUsedRate = (localReceivedMessagesUsedBytes + localLastSeqUsedBytes) / usedBytes;
            }
            info.qosUsedRate = qosUsedRate;

            info.maxBytesKey = maxBytesKey;
            info.maxBytes = maxBytes;
        } catch (e) {
            this.logWarn('获取本地存储信息异常', info, e);
            info.e = { name: e.name, message: e.message };
        }

        return info;
    }

    isSupportLocal() {
        return this.localStoreEnable && !!this.localStorageProxy;
    }

    /**
     * 移除本地存储的数据
     * @param imId
     */
    removeLocalMsg(imId) {
        this.removeLocal(this.localStoragePrefix + imId);
    }

    /**
     * 移除本地存储的数据
     * @param key
     */
    removeLocal(key) {
        try {
            if (this.isSupportLocal()) {
                this.localStorageProxy.removeItem(key);
            }
        } catch (e) {
            this.logWarn('本地移除异常', { key }, e);
        }
    }

    getLocal(key) {
        try {
            if (this.isSupportLocal()) {
                return this.localStorageProxy.getItem(key);
            }
        } catch (e) {
            this.logWarn('获取本地数据异常', { key }, e);
        }

        return null;
    }

    /**
     * info 日志
     * @param title
     * @param data
     */
    logInfo(title, data) {
        try {
            if (!this.logger || typeof this.logger.info != 'function') {
                return;
            }

            this.logger.info({
                module: this.module,
                sceneEvent: this.sceneEvent,
                message: { title: title, data: data, version: this.version }
            });
        } catch (e) {
            console.error('qos日志异常', e);
        }
    }

    /**
     * error日志
     * @param title
     * @param data
     * @param e
     */
    logError(title, data, e) {
        try {
            e = e || {};

            if (!this.logger || typeof this.logger.error != 'function') {
                this.logWarn(title, data, e);
                return;
            }

            this.logger.error({
                module: this.module,
                sceneEvent: this.sceneEvent,
                message: { title: title, data: data, error: { name: e.name, message: e.message }, version: this.version }
            });
        } catch (err) {
            console.error('qos日志异常', err);
        }
    }
    /**
     * warn日志
     * @param title
     * @param data
     * @param e
     */
    logWarn(title = '', data: any = {}, e: any = {}) {
        try {
            e = e || {};

            if (!this.logger || typeof this.logger.warn != 'function') {
                this.logInfo(title, { name: e.name, message: e.message, data: data });
                return;
            }

            this.logger.warn({
                module: this.module,
                sceneEvent: this.sceneEvent,
                message: { title: title, data: data, error: { name: e.name, message: e.message }, version: this.version }
            });
        } catch (err) {
            console.error('qos日志异常', err);
        }
    }

    dateFormat(date: CustomDate) {
        if (!date || !(date instanceof Date)) {
            return '';
        }

        if (typeof date.format != 'function') {
            this.extendDate();
        }

        return date.format('yyyy-MM-dd HH:mm:ss.S');
    }

    extendDate() {
        // @ts-ignore
        Date.prototype.format = function (this: CustomDate, fmt: string) {
            let o = {
                'M+': this.getMonth() + 1, //月份
                'd+': this.getDate(), //日
                'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                'H+': this.getHours(), //小时
                'm+': this.getMinutes(), //分
                's+': this.getSeconds(), //秒
                'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                S: this.getMilliseconds() //毫秒
            };
            let week = {
                '0': '/u65e5',
                '1': '/u4e00',
                '2': '/u4e8c',
                '3': '/u4e09',
                '4': '/u56db',
                '5': '/u4e94',
                '6': '/u516d'
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']
                );
            }
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
            return fmt;
        };
    }
}

export default QosReceive;
