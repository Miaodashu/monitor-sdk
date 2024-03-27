# @monitor-sdk/hash

> 捕获路由中的hash更改

## Usage

### cdn

```html
<script src="[hash-dist]/router_hash.iife.js"></script>
<script>
    window.__MONITOR_OPTIONS__ = {
        dsn: {
            projectID: 'dsdsdsdsdd5d5s5ds5ds5',
            reportUrl: 'localhost:8888/log/upload'
        },
        plugins: [
            HEIMDALLR_HASH(),
        ]
    };
</script>
<script async src="/browser-dist/browser.iife.js"></script>
```

### npm

```js
import monitor from "@monitor-sdk/browser";
import hashPlugin from "@monitor-sdk/router-hash";
monitor({
    dsn: {
        projectID: 'dsdsdsdsdd5d5s5ds5ds5',
        reportUrl: 'localhost:8888/log/upload'
    },
    plugins: [
        hashPlugin(),
    ]
});
```
