# @monitor-sdk/vue


> 捕获 vue 框架抛出的错误

## Options

|配置名称|类型|描述|默认值|可选值|
|-|-|-|-|-|
|vue|Object|vue 实例|-|-|

## Usage

### cdn

```html
<script src="[vue-dist]/vue.iife.js"></script>
<script>
    window.__MONITOR_OPTIONS__ = {
        dsn: {
            projectID: 'dsdsdsdsdd5d5s5ds5ds5',
            reportUrl: 'localhost:8888/log/upload'
        },
        app: {
            name: 'playgroundAPP',
            leader: 'test',
            desc: 'test proj'
        },
        plugins: [
            HEIMDALLR_VUE({
                vue: VueInstance
            }),
        ],
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import monitor from "@monitor-sdk/browser";
import vuePlugin from "@monitor-sdk/vue";
monitor({
    dsn: {
        projectID: 'dsdsdsdsdd5d5s5ds5ds5',
        reportUrl: 'localhost:8888/log/upload'
    },
    app: {
        name: 'playgroundAPP',
        leader: 'test',
        desc: 'test proj'
    },
    plugins: [
        vuePlugin({
            vue: VueInstance
        }),
    ],
});
```
