import {
    BasePluginType,
    BrowserErrorTypes,
    BrowserStackTypes,
    EventTypes,
    ReportDataMsgType,
    ReportDataType,
    StackQueueLevel
} from '@monitor-sdk/types';
import { formatDate, generateUUID } from '@monitor-sdk/utils';

interface CollectedType {
    category: EventTypes;
    data: PromiseRejectionEvent;
}
const promiseError: BasePluginType = {
    name: 'promiseErrorPlugin',
    monitor: (notify: (data: CollectedType) => void) => {
        window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
            e.preventDefault();
            // @ts-ignore
            this.log(e, ConsoleTypes.ERROR);
            notify({
                category: EventTypes.ERROR,
                data: e
            });
        });
    },
    beforeReport: (collectedData: CollectedType): ReportDataType<ReportDataMsgType> => {
        const {
            category,
            data: { reason }
        } = collectedData;
        let message;
        if (typeof reason === 'string') {
            message = reason;
        } else if (typeof reason === 'object' && reason.stack) {
            message = reason.stack;
        }
        const id = generateUUID();
        (this as any).queue.enqueue({
            eventId: id,
            type: BrowserStackTypes.UNHANDLEDREJECTION,
            message: message,
            level: StackQueueLevel.ERROR,
            time: formatDate()
        });
        const queueList = (this as any).queue.queueValue();
        return {
            id,
            time: formatDate(),
            type: category,
            data: {
                sub_type: BrowserErrorTypes.UNHANDLEDREJECTION,
                message
            },
            queue: queueList
        }
    }
};


export default promiseError;