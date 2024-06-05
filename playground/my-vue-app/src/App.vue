<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
let name = ref('hello');
onMounted(() => {
    // throw new Error('示例错误：这是一个未被捕获的错误！');
    console.log('组件 mounted周期');
});
const info = ref();
const handleClick = () => {
    name.value = '123';
    console.log('handleClick--');
    // name.value = sign;
};
const handleClick2 = () => {
    console.log('handleClick2--');
    Promise.reject('Some error occurred');
};
const handleClick3 = () => {
    // name.value = name;
    info.value.name = 888
    return
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'http://localhost:3000/api/site/test');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({name:'张三',age:12}));

    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         // 获取服务器响应的数据
    //         console.log(xhr.responseText);
    //     }
    // };
    fetch('http://localhost:3000/api/site/test')
    fetch('//crm-hd.elong.com/workbenchapi/form/list-field-v2', {
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date().getTime(),
            caller: 'inter.platform.web',
            params: {
                corpusPackageId: 'cp_6da30efe8c0c437d8da0639cfe491704',
                projectId: 'project_9080858e198746ffa2e9667a0e316512',
                corpusIds: [],
                targetLanguages: ['zh-cn', 'en-us']
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            Cookie: '__tctmu=102596417.0.0; __tctmz=102596417.1705541473410.35.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); __tctrack=0; longKey=1707026539695527; businessLine=15f444cf8755447ea4fd58a7a6ac0a93; route=d8e740f212b6a2469f16a4ee9e17745a; prod_apitable_xsrf_token=6d7fcabe-5c54-4822-a268-99563a3b1c20; lang=zh-CN; prod_apitable_token=MDRmYWMyMGMtMzAxOC00OGIzLTlkMGEtYThiNGJmNzlkNTMy; __tctmc=102596417.93733272; __tctmd=102596417.128401801; __tctma=102596417.1707026539695527.1707026539774.1712557365956.1712902450502.19; __tccgd=102596417.0; access_token=e19e116b512de0ef8f6a60a5f463d8c8'
        }
    });
};
const handleClick4 = async () => {
    const res = await fetch('https://crm-hd.elong.com/workbenchapi/notice/unReadCount', {
        method: 'POST',
        body: JSON.stringify({
            timestamp: new Date().getTime(),
            caller: 'inter.platform.web',
            params: {
                corpusPackageId: 'cp_6da30efe8c0c437d8da0639cfe491704',
                projectId: 'project_9080858e198746ffa2e9667a0e316512',
                corpusIds: [],
                targetLanguages: ['zh-cn', 'en-us']
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            Cookie: '__tctmu=102596417.0.0; __tctmz=102596417.1705541473410.35.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); __tctrack=0; longKey=1707026539695527; businessLine=15f444cf8755447ea4fd58a7a6ac0a93; route=d8e740f212b6a2469f16a4ee9e17745a; prod_apitable_xsrf_token=6d7fcabe-5c54-4822-a268-99563a3b1c20; lang=zh-CN; prod_apitable_token=MDRmYWMyMGMtMzAxOC00OGIzLTlkMGEtYThiNGJmNzlkNTMy; __tctmc=102596417.93733272; __tctmd=102596417.128401801; __tctma=102596417.1707026539695527.1707026539774.1712557365956.1712902450502.19; __tccgd=102596417.0; access_token=e19e116b512de0ef8f6a60a5f463d8c8'
        }
    });

    console.log('res???', res);

    // fetch('http://localhost:3000/api/site/demo', {
    //         method: 'GET',
    //         headers: {
    //             'name': 'hello'
    //         }
    //     })
    //     // fetch('http://localhost:3000/api/site/demo22', {
    //     //     method: 'GET',
    //     //     headers: {
    //     //         'name': 'hello'
    //     //     }
    //     // })
};
</script>

<template>
    <header>
        <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
        <button @click="handleClick">点击vue错误</button>
        <button @click="handleClick2">点击promise错误</button>
        <button @click="handleClick3">33XHR发送请求 fetch1</button>
        <button @click="handleClick4">FETCH发送请求 fetch1</button>
        <div class="wrapper">
            <!-- <img src="./aaa.png" alt="ddddd" /> -->
            <HelloWorld msg="You did it!" />
            {{ name }}
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
