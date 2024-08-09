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
// import monitor from "@monitor-sdk/browser";
// import presets from "@monitor-sdk/presets";
import App from './App.vue';
import router from './router';
const app = createApp(App);


monitor({
    dsn: {
        reportUrl: 'http://localhost:3000/upload',
        projectId: 'c42c223d-d431-4812-b014-4e7e36b58116'
    },
    debuge: true,
    // userIdentify: {
    //     name: 'access_token',
    //     postion: 'cookie'
    // },
    plugins: [
        // ...presets({
        //     vue: app,
        //     ignoreUrls: ['**/workbenchapi/**']
        // }),
        consolePlugin(),
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
