# `@monitor-sdk/utils`

> 浏览器监控基座， 内置了错误手机捕获以及页面load和unload钩子捕获

可捕获的错误类型

- js错误
- 资源加载错误
- promise错误


## Usage


### app

|名称|类型|描述|可选值|
|-|-|-|-|
|name|String|应用名称|-|
|leader|String|负责人|-|
|desc|String|应用描述|-|

### userIdentify

|名称|类型|描述|可选值|
|-|-|-|-|
|name|string|业务字段名称（支持点运算符读取，cookie除外）|-|
|postion|string|存储位置|local/session/cookie/global|

### cdn

```html
<script>
    window.__MONITOR_OPTIONS__ = {
        dsn: {
            projectId: 'dsdsdsdsdd5d5s5ds5ds5',
            reportUrl: 'localhost:8888/log/upload'
        },
        app: {
            name: 'playgroundAPP',
            leader: 'test',
            desc: 'test proj'
        },
        userIdentify: {
            name: '__state__.a.0.user.id', // window.__state__ = { a: [{ user: { id:'123' } }] }
            position: 'global'
        }
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```


```js
(function () {
    var script = document.createElement('script');
    script.text = `
        window.__MONITOR_OPTIONS__ = {
            dsn: {
                projectId: 'dsdsdsdsdd5d5s5ds5ds5',
                reportUrl: 'localhost:8888/log/upload'
            },
            app: {
                name: 'playgroundAPP',
                leader: 'test',
                desc: 'test proj'
            },
            userIdentify: {
                name: '__state__.a.0.user.id', // window.__state__ = { a: [{ user: { id:'123' } }] }
                position: 'global'
            }
        };
    `;
    document.head.appendChild(script);

    script = document.createElement('script');
    script.src = '/browser-dist/browser.iife.js';
    script.async = true;
    document.head.appendChild(script);
})();
```

### npm

```js
import monitor from "@monitor-sdk/browser";
monitor({
    dsn: {
        projectId: 'dsdsdsdsdd5d5s5ds5ds5',
        reportUrl: 'localhost:8888/log/upload'
    },
    app: {
        name: 'playgroundAPP',
        leader: 'test',
        desc: 'test project'
    },
    userIdentify: {
        name: '__state__.a.0.user.id', // window.__state__ = { a: [{ user: { id:'123' } }] }
        position: 'global'
    }
});
```