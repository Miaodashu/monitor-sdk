import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import monitor from '../../../packages/browser/esm';
import vuePlugin from '../../../packages/vue/esm'
import performancePlugin from '../../../packages/performance/esm'
import hashPlugin from '../../../packages/router_hash/esm'
import historyPlugin from '../../../packages/router_history/esm'
import xhrPlugin from '../../../packages/xhr/esm'
import fetchPlugin from '../../../packages/fetch/esm';
import presets from '../../../packages/presets/esm';
import consolePlugin from '../../../packages/console/esm';
import domPlugin from '../../../packages/dom/esm';
// import monitor from "@monitor-sdk/browser";
// import presets from "@monitor-sdk/presets";
import App from './App.vue';
import router from './router';
import { minimatchFn } from './text';
const app = createApp(App);
const result = minimatchFn('//crm-hd.elong.com/workbenchapi/form/list-field-v2', '**/workbenchapi/**');
const result1 = minimatchFn('//crm-hd.elong.com/workbenchapi/form/list-field-v2', '//crm-hd.elong.com/workbenchapi/form/list-field-v2');
console.log('result1, ', result1);


monitor({
    dsn: {
        reportUrl: 'http://localhost:3000/monitor/server/api/log/upload',
        projectId: '0d71313f-2a65-4746-b50f-83fe0883434b'
    },
    app: {
        name: 'test-vue-app',
        leader: '张三'
    },
    // userIdentify: {
    //     name: 'access_token',
    //     postion: 'cookie'
    // },
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
