
import { BasePluginType, EventTypes, RouteMsgType, ReportDataType, RouteDataMsgType, RouteTypes, BrowserStackTypes, StackQueueLevel } from '@monitor-sdk/types'
import { formatDate, generateUUID } from '@monitor-sdk/utils';

export default function VueRouterHashPlugin(): BasePluginType {
    return {
        name: 'routerHashPlugin',
        monitor(publish: (data: RouteDataMsgType) => void) {
            window.addEventListener('hashchange', (e: HashChangeEvent) => {
                const { newURL, oldURL } = e;
                if (newURL === oldURL) {
                    return;
                }
                publish({
                    from: oldURL,
                    to: newURL,
                })

            })
        },
        beforeReport(data: RouteDataMsgType): ReportDataType<RouteMsgType> {
            let id = generateUUID();
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.ROUTE,
                level: StackQueueLevel.INFO,
                message: `HashChange:  从 "${data.from}" 到 "${data.to}"`
            })
            return {
                id,
                time: formatDate(),
                type: EventTypes.ROUTE,
                data: {
                    sub_type: RouteTypes.HASH,
                    ...data
                },
            }
        }
    }
}