import { CallBack } from './common'
import { ReportDataType } from './base';


export interface BasePluginType {
    name: string;
    // 插件逻辑的具体实现放在这个函数体中
    monitor: (notify: CallBack) => void;
    // 上报 之前 做一些事情  比如 数据格式转换
    beforeReport?: (collectedData: any) => ReportDataType<any>;
    [key: string]: any;
}
