import xhrPlugin from '@tc-track/xhr';
import historyPlugin from '@tc-track/router-history';
import hashPlugin from '@tc-track/router-hash';
import vuePlugin from '@tc-track/vue';
import fetchPlugin from '@tc-track/fetch';
import performancePlugin from '@tc-track/performance';
import { VueInstance } from '@tc-track/types';
import domPlugin from '@tc-track/dom';

export enum PerformanceFeat {
    BASIC = 'basic',
    RESOURCE = 'resource',
}

interface presetsOption {
    vue?: VueInstance; // vue实例
    reportResponds?: boolean; // 是否上报响应数据
    ignoreUrls?: string[]; // 忽略上报的url
    performancOff?: PerformanceFeat[]; // 性能监控黑名单
}

export default function (options: presetsOption = {}) {
    const { vue, ignoreUrls = [], reportResponds = true, performancOff = [] } = options;
    const plugins = [
        performancePlugin({
            performancOff: performancOff
        }),
        domPlugin(),
        hashPlugin(),
        historyPlugin(),
        xhrPlugin({
            reportResponds: reportResponds,
            ignoreUrls
        }),
        fetchPlugin({ reportResponds: reportResponds, ignoreUrls })
    ];
    if (vue) {
        plugins.push(vuePlugin({
            vue: vue
        }))
    }
    return plugins;
}
