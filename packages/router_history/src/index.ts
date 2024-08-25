import { BasePluginType, BrowserStackTypes, EventTypes, ReportDataType, RouteDataMsgType, RouteMsgType, RouteTypes } from "@monitor-sdk/types";
import { formatDate, generateUUID, replaceOld } from "@monitor-sdk/utils";


export default function (): BasePluginType {
    return {
        name: 'routerHistoryPlugin',
        monitor(publish: (data: RouteDataMsgType) => void) {
            let lastHref = '';
            const popstateOrigin = window.onpopstate;
            // 重新popstate，添加监听
            window.onpopstate = function (this: WindowEventHandlers, ...argv: any[]) {
                const to = window.location.href;
                const from = lastHref;
                lastHref = to;
                publish({
                    from,
                    to
                })
                popstateOrigin && popstateOrigin.apply(this, argv);
            }

            function historyReplaceFn(originFn) {
                return function (this: History, ...args: any[]) {
                    const url = args.length > 2 ? args[2] : undefined;
                    if (url) {
                        const from = lastHref;
                        const to = String(url);
                        lastHref = to;
                        publish({
                            from,
                            to
                        })
                    }
                    return originFn.apply(this, args);
                }
            }
            replaceOld(window.history, 'pushState', historyReplaceFn);
            replaceOld(window.history, 'replaceState', historyReplaceFn);
        },
        beforeReport(data: RouteDataMsgType): ReportDataType<RouteMsgType> {
            const id = generateUUID()
            const { from, to } = data;
            if (from === to) {
                return;
            }
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.ROUTE,
                message: `HistoryChange: 从 "${data.from}" 到 "${data.to}"`
              });
              return {
                st: formatDate(),
                type: EventTypes.ROUTE,
                data: {
                  sub_type: RouteTypes.HISTORY,
                  ...data
                }
              };
        }
    }
}