<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
let name = ref('hello');
onMounted(() => {
    // throw new Error('示例错误：这是一个未被捕获的错误！');
});

const handleClick = () => {
    name.value = '123';
    name.value = sign;
};
const handleClick2 = () => {
    
    Promise.reject('Some error occurred');
};
const handleClick3 = () => {
    // name.value = name;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/api/site/test');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({name:'张三',age:12}));

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 获取服务器响应的数据
            console.log(xhr.responseText);
        }
    };
}
const handleClick4 = () => {
    fetch('http://localhost:3000/api/site/test', {
            method: 'GET',
            headers: {
                'name': 'hello'
            }
        })
}
</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
        <button @click="handleClick">点击vue错误</button>
        <button @click="handleClick2">点击promise错误</button>
        <button @click="handleClick3">XHR发送请求</button>
        <button @click="handleClick4">FETCH发送请求</button>
        <div class="wrapper">
            <img src="./aaa.png" alt="ddddd" />
            <HelloWorld msg="You did it!" />
            {{ name }}
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <RouterView />
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
