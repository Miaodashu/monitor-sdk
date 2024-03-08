import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import monitor from "../../../packages/browser/esm";
import vuePlugin from '../../../packages/vue/esm'
import performancePlugin from '../../../packages/performance/esm'
import hashPlugin from '../../../packages/router_hash/esm'
import historyPlugin from '../../../packages/router_history/esm'
import xhrPlugin from '../../../packages/xhr/esm'
import fetchPlugin from '../../../packages/fetch/esm'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
monitor({
    dsn: {
        reportUrl: 'http://localhost:3000/api/log/upload',
        projectId: '65b6a10a-7d1a-4a98-bc76-e5c71d5df65c'
    },
    app: {
        name: 'vue-test-demo',
        leader: '赵鹏鹏'
    },
    // userIdentify: {
    //     name: 'access_token',
    //     postion: 'cookie'
    // },
    debuge: true,
    plugins: [
        performancePlugin(),
        vuePlugin({
            vue: app
        }),
        hashPlugin(),
        historyPlugin(),
        xhrPlugin(),
        fetchPlugin()
    ]
})