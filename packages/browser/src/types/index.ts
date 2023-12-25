import { BaseOptionsType, ClientInfoType, CustomerOptionType, EventTypes, PageLifeType } from '@monitor-sdk/types';

export interface LifecycleOptions {
    /**
     * 用户标识（已登录用户）
     */
    userIdentify?: CustomerOptionType;
}

// 浏览器端配置
export interface BrowserOptionType extends LifecycleOptions, BaseOptionsType {}


// 浏览器端上报数据类型
export interface BrowserReportPayloadDataType extends ClientInfoType {
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