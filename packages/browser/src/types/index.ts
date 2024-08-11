import { Recordable, BaseOptionsType, ClientInfoType, CustomerOptionType, EventTypes, PageLifeType } from '@monitor-sdk/types';

export interface LifecycleOptions {
    /**
     * 用户标识（已登录用户）
     */
    userIdentify?: CustomerOptionType;
}

// 浏览器端配置
export interface BrowserOptionType extends LifecycleOptions, BaseOptionsType {}

export type LogData = ClientInfoType | Recordable
export interface BrowserReportPayloadDataType extends ClientInfoType {
    logData: LogData;
    filterTwo: string;
    filterOne: string;
    subCategory: string;
    category: string;
    module: string;
    [key: string]: any;
}

export interface LifecycleDataType {
    type: PageLifeType;
    session_id: string;
    user_id: string;
    href?: string;
    time?: string;
}

export interface CollectedType<T = any> {
    category: EventTypes;
    data: T;
}
