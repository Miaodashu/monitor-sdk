import { BrowserSubTypes, EventTypes, PlatformTypes } from './constant';
import { BasePluginType } from './plugin';
import { QueueData } from './queue';

export interface AppInfoType {
    name: string; // 项目名称
    leader: string;
    desc?: string;
}

export interface DSN {
    /**
     * 上报的域名地址
     */
    // host: string;
    // /**
    //  * 应用初始化接口地址
    //  */
    // initUrl: string;
    /**
     * 信息上报接口地址
     */
    reportUrl: string;
    projectId: string;
}

// 供基类和子类获取核心配置使用， 也可直接使用 option: BaseOptionsType
export interface CoreContextType {
    app?: AppInfoType;
    uploadUrl: string;
    initUrl?: string;
    debuge: boolean;
    enabled: boolean;
}

// sdk基础配置项  初始化传入
export interface BaseOptionsType {
    // 上报的接口信息
    dsn: DSN;
    // 应用信息
    app?: AppInfoType;
    // 是否开启debuge模式
    debuge?: boolean;
    // 是否应激活并向后台发送事件
    enabled?: boolean;
    // 插件
    plugins?: BasePluginType[];
    // 队列最大层级
    maxQueueLength?: number;
}

// 事件上报的数据格式  客户端 浏览器端会上报的格式，
export interface ClientInfoType {
    deviceInfo: string; // json字符串  平台信息， 包含设备类型，网络，系统等信息
    app_id?: string; // 应用id
    session_id?: string; // 会话id
    page_title?: string; // 页面标题
    path?: string; // 页面路径
    language?: string; // 语言
    user_agent?: string; // 用户代理
}


// 事件上报的数据格式  基础的数据格式, 插件上报前钩子中返回的数据格式
export interface ReportDataType<T> {
    id: string;
    time: string;
    type: EventTypes; // 时间类型
    data: T; // 消息体
    queue?: QueueData[]; // 队列数据
}


// 上报数据 消息体data中data 的类型
export interface ReportDataMsgType {
    sub_type: BrowserSubTypes | string;
    [key: string]: any;
  }
