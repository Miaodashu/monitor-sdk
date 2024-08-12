# `@tc-track/xhr`

> TODO: 捕获xhr的请求信息  请求，上报请求头、响应、请求耗时

## Options

|配置名称|类型|是否必填|描述|默认值|
|-|-|-|-|-|
|ignoreUrls|Array|否|过滤请求url|-|
|reportResponds|Boolean|否|是否上报返回值|false|



## Usage

### cdn

```html
<script src="[xhr-dist]/xhr.iife.js"></script>
<script>
    window.__MONITOR_OPTIONS__ = {
        dsn: {
            host: 'localhost:8888',
            init: '/project/init',
            upload: '/log/upload'
        },
        plugins: [
            MONITOR_XHR(),
        ],
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import monitor from "@tc-track/browser";
import xhrPlugin from "@tc-track/xhr";
monitor({
    dsn: {
        host: 'localhost:8888',
        init: '/project/init',
        upload: '/log/upload'
    },
    plugins: [
        xhrPlugin(),
    ],
});
```
