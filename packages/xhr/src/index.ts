import { HttpCollectDataType, HttpCollectType, BasePluginType, IAnyObject, ReportDataType, StackQueueLevel, BrowserStackTypes, EventTypes, HttpTypes } from '@monitor-sdk/types';
import { formatDate, generateUUID, getUrlPath, replaceOld, minimatchFn } from '@monitor-sdk/utils';


interface RequestOptions {
    ignoreUrls?: string[]; // 忽略的请求
    reportResponds?: boolean; // 是否上报返回值
}

interface XMLHttp extends IAnyObject {
    httpCollect: HttpCollectDataType;
}

export default function XHRPlugin(options: RequestOptions = {}): BasePluginType {
    const { ignoreUrls = [], reportResponds = false } = options;
    const originalXhrProto = XMLHttpRequest.prototype;
    return {
        name: 'XHRPlugin',
        monitor(publish: (data: HttpCollectDataType) => void) {
            let { reportUrl } = this.context;
            const ignore = [...ignoreUrls, reportUrl].map((url) => getUrlPath(url));
            replaceOld(originalXhrProto, 'open', (originFn) => {
                return function (this: XMLHttp, ...args: any[]) {
                    this.httpCollect = {
                        request: {
                            method: args[0] ? args[0].toUpperCase() : args[0],
                            url: args[1]
                        },
                        response: {},
                        time: Date.now()
                    };
                    originFn.apply(this, args);
                };
            });
            replaceOld(originalXhrProto, 'send', (originFn) => {
                return function(this, ...args: any[]) {
                    const { request } = this.httpCollect
                    const { url } = request
                    this.addEventListener("loadend", function(this) {
                        // const isHasIgnore = ignore.includes(getUrlPath(url));
                        const isHasIgnore = ignore.some((ignoreUrl) => {
                            let result = minimatchFn(getUrlPath(url), ignoreUrl);
                            return result;
                        });
                        if (isHasIgnore) return;
                        this.httpCollect.response.status = this.status
                        request.data = args[0];
                        if (reportResponds) {
                            this.httpCollect.response.data = typeof this.response === 'object' ? JSON.stringify(this.response) : this.response;
                        }
                        const eTime = Date.now();

                        this.httpCollect.elapsedTime = eTime - this.httpCollect.time;
                        publish(this.httpCollect)
                    });
                    
                    originFn.apply(this, args);
                }
            })
        },
        beforeReport(collectData: HttpCollectDataType): ReportDataType<HttpCollectType> {
            const id = generateUUID();
            const {
                request: { method, url },
                elapsedTime = 0,
                response: { status }
              } = collectData;
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.XHR,
                level: status != 200 ? StackQueueLevel.WARN : StackQueueLevel.INFO,
                message: `${method} "${url}" 耗时 ${elapsedTime / 1000} 秒`
            })
            return {
                type: EventTypes.API,
                st: formatDate(),
                data: {
                    ...collectData,
                    sub_type: HttpTypes.XHR
                }
            }
        }
    };
}
