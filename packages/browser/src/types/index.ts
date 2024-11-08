import { Recordable, BaseOptionsType, ClientInfoType, CustomerOptionType, EventTypes, PageLifeType, AppInfoType } from '@tc-track/types';

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
    appInfo: AppInfoType;
    extendInfo?: any;
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
