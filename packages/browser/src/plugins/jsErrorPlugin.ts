import {
    BasePluginType,
    ConsoleTypes,
    EventTypes,
    ReportDataType,
    BrowserErrorTypes,
    BrowserStackTypes,
    StackQueueLevel,
    ReportDataMsgType
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
    monitor: (publish: (data: CollectedType) => void) => {
        window.addEventListener(
            'error',
            (e) => {
                e.preventDefault();
                // 插件的this已经指向到对应的平台类了，所以可以直接调用log方法
                // 这里报this为undefinde 不知道咋解决， 先忽略点
                // @ts-ignore
                this.log(e, ConsoleTypes.ERROR);
                publish({
                    category: EventTypes.ERROR,
                    data: e
                });
            },
            true
        );
    },
    beforeReport: (collectedData: CollectedType): ReportDataType<ReportDataMsgType> => {
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
                src: src || currentSrc
            };
            // @ts-ignore
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.RESOURCE,
                message: `加载 ${resourceData.source_type} 资源错误, 地址："${resourceData.src} "`,
                level: StackQueueLevel.ERROR,
                time
            });
            const queueList = (this as any).queue.queueValue();
            return {
                id,
                time,
                type: category,
                data: {
                    sub_type: BrowserErrorTypes.RESOURCEERROR,
                    ...resourceData
                },
                queue: queueList
            };
        }
        // 代码错误
        const { message, lineno, colno, filename } = data as ErrorEvent;
        // 上报用户行为栈
        (this as any).queue.enqueue({
            eventId: id,
            type: BrowserStackTypes.CODE_ERROR,
            level: StackQueueLevel.ERROR,
            message
        });
        const queueList = (this as any).queue.queueValue();
        return {
            id,
            time,
            type: category,
            queue: queueList,
            data: {
                sub_type: BrowserErrorTypes.CODEERROR,
                message,
                lineno,
                colno,
                filename
            }
        };
    }
};

export default errorPlugin;