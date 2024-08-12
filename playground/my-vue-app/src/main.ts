import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import monitor from '../../../packages/browser/esm';
import vuePlugin from '../../../packages/vue/esm';
import performancePlugin from '../../../packages/performance/esm';
import hashPlugin from '../../../packages/router_hash/esm';
import historyPlugin from '../../../packages/router_history/esm';
import xhrPlugin from '../../../packages/xhr/esm';
import fetchPlugin from '../../../packages/fetch/esm';
import presets from '../../../packages/presets/esm';
import consolePlugin from '../../../packages/console/esm';
import domPlugin from '../../../packages/dom/esm';
// import monitor from "@monitor-sdk/browser";
// import presets from "@monitor-sdk/presets";
import App from './App.vue';
import router from './router';
const app = createApp(App);

let trackClass = monitor({
    dsn: {
        _openid: '辅助模块',
        _unionid: '',
        _userId: '',
        _vrcode: '10188-285-0'
    },
    app: {
        name: 'test-vue-app',
        leader: '张三'
    },
    userIdentify: {
        name: 'access_token',
        postion: 'cookie'
    },
    // enabled: false,
    debuge: true,
    plugins: [
        // ...presets({
        //     vue: app,
        //     ignoreUrls: ['**/workbenchapi/**']
        // }),
        consolePlugin(),
        domPlugin(),
        performancePlugin(),
        vuePlugin({
            vue: app
        }),
        hashPlugin(),
        historyPlugin(),
        xhrPlugin(),
        fetchPlugin()
    ]
});
app.use(createPinia());
app.use(router);

app.mount('#app');
