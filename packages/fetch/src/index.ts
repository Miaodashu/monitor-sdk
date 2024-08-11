import { formatDate, generateUUID, getUrlPath, replaceOld, minimatchFn } from '@monitor-sdk/utils';
import {
    BasePluginType,
    ReportDataType,
    HttpCollectDataType,
    HttpCollectType,
    MethodTypes,
    BrowserStackTypes,
    StackQueueLevel,
    EventTypes,
    HttpTypes
} from '@monitor-sdk/types';

interface RequestOptions {
    ignoreUrls?: string[]; // 忽略的请求
    reportResponds?: boolean; // 是否上报返回值
}

export default function fetchPlugin(options: RequestOptions = {}): BasePluginType {
    const { ignoreUrls = [], reportResponds = false } = options;
    return {
        name: 'fetchPlugin',
        monitor(publish: (data: HttpCollectDataType) => void) {
            const { reportUrl } = this.context;
            const that = this;
            const ignore = [...ignoreUrls, reportUrl].map((url) => getUrlPath(url));
            replaceOld(window, 'fetch', (originFn) => {
                return function (url: string, config: Partial<Request> = {}) {
                    const sTime = Date.now();
                    const httpCollect: HttpCollectDataType = {
                        request: {
                            url,
                            data: config && config.body,
                            method: config.method ? config.method.toUpperCase() : MethodTypes.GET
                        },
                        response: {},
                        time: sTime
                    };
                    const isBlock = ignore.some((ignoreUrl) => {
                        let result = minimatchFn(getUrlPath(url), ignoreUrl);
                        return result;
                    });
                    // const isBlock = ignore.includes(getUrlPath(url));
                    const headers = new Headers(config.headers || {});
                    Object.assign(headers, {
                        setRequestHeader: headers.set
                    });
                    config = {
                        ...config,
                        headers
                    };
                    return originFn.apply(window, [url, config]).then(
                        (response) => {
                            const resClone = response.clone();
                            const eTime = Date.now();
                            httpCollect.elapsedTime = eTime - sTime;
                            httpCollect.response.status = resClone.status;
                            resClone.text().then((data) => {
                                if (isBlock) return;
                                if (reportResponds) {
                                    httpCollect.response.data = data;
                                }
                                publish(httpCollect);
                            });
                            return response;
                        },
                        (err: Error) => {
                            if (isBlock) return;
                            const eTime = Date.now();
                            httpCollect.elapsedTime = eTime - sTime;
                            httpCollect.response.status = 0;
                            publish(httpCollect);
                            throw err;
                        }
                    );
                };
            });
        },
        beforeReport(collectData): ReportDataType<HttpCollectType> {
            const id = generateUUID();
            const {
                request: { method, url },
                elapsedTime = 0,
                response: { status }
            } = collectData;
            return {
                id,
                type: EventTypes.API,
                time: formatDate(),
                data: {
                    ...collectData,
                    message: `${method} "${url}" 耗时 ${elapsedTime / 1000} 秒`,
                    sub_type: HttpTypes.FETCH
                }
            };
        }
    };
}
