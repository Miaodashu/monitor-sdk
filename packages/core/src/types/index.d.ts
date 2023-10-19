import { BasePluginType } from './plugin';
import { AppInfoType, DSN } from './base';

export interface CoreContextType {
    app: AppInfoType;
    uploadUrl: string;
    initUrl?: string;
    debuge: boolean;
    enabled: boolean;
}

export interface BaseOptionsType {
    // 上报的接口信息
    dsn: DSN;
    // 应用信息
    app: AppInfoType;
    // 是否开启debuge模式
    debuge?: boolean;
    // 是否应激活并向后台发送事件
    enabled?: boolean;
    // 插件
    plugins?: BasePluginType[];
    // 队列最大层级
    maxQueueLength?: number;
}
