export interface IAnyObject {
    [key: string]: any;
}

export type Recordable<T = any> = Record<string, T>;

export type CallBack = (...args: any[]) => void;

export interface QosQueueItem<T = QosMessageData> {
    extendData: T;
    startCallBack: CallBack;
}

// 定义 JSON 中的数据结构， 实际的消息体
export interface MessageContent {
    isHistory: boolean;
    msgTraceId: string;
    message: any[];
    hasMore: boolean;
}

// qos服务拉去的消息题
export interface QosMessageData {
    msgTraceId: string;
    _im_qos_flag: boolean;
    senderId: string;
    receiverId: string;
    imId: string;
    seqData: object;
    userKey: string;
    retryNum: number;
    sendTime: number;
    imServer: string;
    routeApi: string;
    msgType: string;
    appUk: string;
    Name?: null;
    Message: MessageContent;
    [key: string]: any;
}

export interface CustomDate extends Date {
    format(fmt: string): string;
}

export interface LocalInfo {
    localStorageSize: number;
    receivedMessagesSize: number;
    localReceivedMessagesSize: number;
    localReceivedMessagesUsedBytes: number;
    localLastSeqSize: number;
    localLastSeqUsedBytes: number;
    usedBytes: number;
    qosUsedRate: number;
    maxBytesKey: string;
    maxBytes: number;
    e: any;
}
