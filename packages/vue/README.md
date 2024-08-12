# @tc-track/vue

[English](./README_en.md)

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
            host: 'localhost:8888',
            init: '/project/init',
            upload: '/log/upload'
        },
        plugins: [
            MONITOR_VUE({
                vue: VueInstance
            }),
        ],
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import monitor from "@tc-track/browser";
import vuePlugin from "@tc-track/vue";
monitor({
    dsn: {
        host: 'localhost:8888',
        init: '/project/init',
        upload: '/log/upload'
    },
    plugins: [
        vuePlugin({
            vue: VueInstance
        }),
    ],
});
```
