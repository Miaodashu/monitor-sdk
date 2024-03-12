# `@monitor-sdk/presets`

插件预设包， 把基本要使用的插件 集合到一起， 方便用户使用。

## Usage

```
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
```
