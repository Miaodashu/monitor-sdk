import {
    BasePluginType,
    EventTypes,
    ReportDataType,
    BrowserErrorTypes,
    ReportDataMsgType,
    ConsoleTypes
} from '@monitor-sdk/types';
import { formatDate, generateUUID } from '@monitor-sdk/utils';

interface CollectedType {
    category: EventTypes;
    data: Event;
}
interface ResourceTarget {
    src?: string;
    currentSrc?: string;
    localName?: string;
}

const errorPlugin: BasePluginType = {
    name: 'jsErrorPlugin',
    monitor(publish: (data: CollectedType) => void) {
        window.addEventListener(
            'error',
            (e) => {
                this.log(e, ConsoleTypes.ERROR)
                e.preventDefault();
                publish({
                    category: EventTypes.ERROR,
                    data: e
                });
            },
            true
        );
    },
    beforeReport(collectedData: CollectedType): ReportDataType<ReportDataMsgType> {
        const { category, data } = collectedData;
        var isElementTarget =
            data.target instanceof HTMLScriptElement || data.target instanceof HTMLLinkElement || data.target instanceof HTMLImageElement;
        const id = generateUUID();
        const time = formatDate();
        // 判断是否是资源类型报错
        if (isElementTarget) {
            const { currentSrc, src, localName } = data.target as ResourceTarget;
            // 资源加载错误，上报类型和链接
            const resourceData = {
                source_type: localName,
                message: `加载 ${localName} 资源错误, 地址："${src || currentSrc} "`,
                src: src || currentSrc
            };
            return {
                id,
                time,
                type: category,
                data: {
                    sub_type: BrowserErrorTypes.RESOURCEERROR,
                    ...resourceData
                }
            };
        }
        // 代码错误
        const { message, lineno, colno, filename, error } = data as ErrorEvent;
        return {
            id,
            time,
            type: category,
            data: {
                sub_type: BrowserErrorTypes.CODEERROR,
                message,
                lineno,
                colno,
                stack: error ? error?.stack : '',
                filename
            }
        };
    }
};
export default errorPlugin;
