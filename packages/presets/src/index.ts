import xhrPlugin from '@monitor-sdk/xhr';
import historyPlugin from '@monitor-sdk/router-history';
import hashPlugin from '@monitor-sdk/router-hash';
import vuePlugin from '@monitor-sdk/vue';
import fetchPlugin from '@monitor-sdk/fetch';
import performancePlugin from '@monitor-sdk/performance';
import { VueInstance } from '@monitor-sdk/types';

export enum PerformanceFeat {
    BASIC = 'basic',
    RESOURCE = 'resource',
    FMP = 'fmp',
    FPS = 'fps',
    VITALS = 'vitals'
}

interface presetsOption {
    vue?: VueInstance; // vue实例
    reportResponds?: boolean; // 是否上报响应数据
    ignoreUrls?: string[]; // 忽略上报的url
    performancOff?: PerformanceFeat[]; // 性能监控黑名单
}

export default function (options: presetsOption = {}) {
    const { vue, ignoreUrls = [], reportResponds = true, performancOff = [] } = options;
    return [
        performancePlugin({
            performancOff: performancOff
        }),
        vue &&
            vuePlugin({
                vue: vue
            }),
        hashPlugin(),
        historyPlugin(),
        xhrPlugin({
            reportResponds: reportResponds,
            ignoreUrls
        }),
        fetchPlugin({ reportResponds: reportResponds, ignoreUrls })
    ];
}
