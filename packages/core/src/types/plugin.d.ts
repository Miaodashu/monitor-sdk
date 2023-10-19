import { EventTypes } from './constant';
import { BreadcrumbPushData } from './stack';
import { CallBack } from './common'

export interface ReportDataType<T> {
    id: string;
    time: string;
    type: EventTypes;
    data: T;
    breadcrumb?: BreadcrumbPushData[];
}


export interface BasePluginType {
    name: string;
    // 插件逻辑的具体实现放在这个函数体中
    monitor: (notify: CallBack) => void;
    // 上报 之前 做一些事情  比如 数据格式转换
    beforeReport?: (collectedData: any) => ReportDataType<any>;
    [key: string]: any;
}
