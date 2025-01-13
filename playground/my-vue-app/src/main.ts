import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import monitor from '../../../packages/browser/esm';
import vuePlugin from '../../../packages/vue/esm'
import recordPlugin from '../../../packages/record/esm';
// // import performancePlugin from '../../../packages/performance/esm'
// // import hashPlugin from '../../../packages/router_hash/esm'
// // import historyPlugin from '../../../packages/router_history/esm'
// // import xhrPlugin from '../../../packages/xhr/esm'
// import fetchPlugin from '../../../packages/fetch/esm';
// import presets from '../../../packages/presets/esm';
// import consolePlugin from '../../../packages/console/esm';
// import monitor from "@monitor-sdk/browser";
// import presets from "@monitor-sdk/presets";
import App from './App.vue';
import router from './router';
// import { minimatchFn } from './text';
const app = createApp(App);
// const result = minimatchFn('//crm-hd.elong.com/workbenchapi/form/list-field-v2', '**/workbenchapi/**');
// const result1 = minimatchFn('//crm-hd.elong.com/workbenchapi/form/list-field-v2', '//crm-hd.elong.com/workbenchapi/form/list-field-v2');


monitor({
    dsn: {
        reportUrl: '//tcwlservice.qa.17usoft.com/livechat/route/out/api/testMaiDian/save',
        projectId: '222222'
    },
    // userIdentify: {
    //     name: 'access_token',
    //     postion: 'cookie'
    // },
    debuge: true,
    enabledDeviceInfo: false,
    enabledBasePlugins: false,
    enabled: false,
    plugins: [
        recordPlugin(
            // { recordCrossOriginIframes: true }
        ),
        // performancePlugin(),
        // vuePlugin({
        //     vue: app
        // }),
        // hashPlugin(),
        // historyPlugin(),
        // xhrPlugin(),
        // fetchPlugin()
    ]
});
app.use(createPinia());
app.use(router);

app.mount('#app');
