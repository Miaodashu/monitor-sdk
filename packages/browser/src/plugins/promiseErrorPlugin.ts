import {
    BasePluginType,
    BrowserErrorTypes,
    BrowserStackTypes,
    EventTypes,
    ReportDataMsgType,
    ReportDataType,
    StackQueueLevel,
    ConsoleTypes
} from '@tc-track/types';
import { formatDate, generateUUID } from '@tc-track/utils';

interface CollectedType {
    category: EventTypes;
    data: PromiseRejectionEvent;
}

export default function promiseError(): BasePluginType {
    return {
        name: 'promiseErrorPlugin',
        monitor (notify: (data: CollectedType) => void) {
            window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
                e.preventDefault();
                this.log(e, ConsoleTypes.ERROR);
                notify({
                    category: EventTypes.ERROR,
                    data: e
                });
            });
        },
        beforeReport(collectedData: CollectedType): ReportDataType<ReportDataMsgType> {
            const {
                category,
                data: { reason }
            } = collectedData;
            let message = 'Unknown Promise rejection';
            if (typeof reason === 'string') {
                message = reason;
            } else if (typeof reason === 'object' && reason !== null && reason.stack) {
                message = reason.stack;
            }
            const id = generateUUID();
            return {
                id,
                time: formatDate(),
                type: category,
                data: {
                    sub_type: BrowserErrorTypes.UNHANDLEDREJECTION,
                    message
                },
            };
        }
    };
}
