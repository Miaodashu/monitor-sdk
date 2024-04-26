import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import monitor from '../../../packages/browser/esm';
// // import vuePlugin from '../../../packages/vue/esm'
// // import performancePlugin from '../../../packages/performance/esm'
// // import hashPlugin from '../../../packages/router_hash/esm'
// // import historyPlugin from '../../../packages/router_history/esm'
// // import xhrPlugin from '../../../packages/xhr/esm'
import fetchPlugin from '../../../packages/fetch/esm';
import presets from '../../../packages/presets/esm';
// import monitor from "@monitor-sdk/browser";
// import presets from "@monitor-sdk/presets";
import App from './App.vue';
import router from './router';

const app = createApp(App);
monitor({
    dsn: {
        reportUrl: 'http://localhost:3000/monitor/server/api/log/upload',
        projectId: '0d71313f-2a65-4746-b50f-83fe0883434b'
    },
    // userIdentify: {
    //     name: 'access_token',
    //     postion: 'cookie'
    // },
    debuge: true,
    plugins: [
        // ...presets()
        // performancePlugin(),
        // vuePlugin({
        //     vue: app
        // }),
        // hashPlugin(),
        // historyPlugin(),
        // xhrPlugin(),
        fetchPlugin()
    ]
});
app.use(createPinia());
app.use(router);

app.mount('#app');

