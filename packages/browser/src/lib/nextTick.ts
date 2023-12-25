// 这里主要是实现浏览器端的异步方案， 优先使用promise， 降级采用MutationObserver
/**
 * 浏览器端异步方案， 逐步降级如下
 * 1. promise
 * 2. MutationObserver
 * 3. setTimeout
 */

const callbacks:Function[] = [];
let pedding = false;
let timerFunc: Function;

if (typeof Promise !== 'undefined') {
    let p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
    };
} else if (typeof MutationObserver !== 'undefined' && 'MutationObserver' in window) {
    let counter = 1;
    let observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    }
}

/**
 * 清除所有挂起的回调函数
 */
function flushCallbacks() {
    pedding = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (const func of copies) {
        func();
    }
}


/**
 * 下一轮循环执行回调函数
 *
 * @param cb 回调函数
 * @param ctx 上下文对象
 * @param argv 回调函数参数
 */
export function nextTick(cb: Function, ctx: Object, ...argv: any[]) {

    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx, ...argv)
            } catch (error) {
                console.error(error);
            }
        } else if(_resolve) {
            _resolve(argv)
        }
    })

    if (!pedding) {
        pedding = true;
        timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
        new Promise((resolve) => {
          _resolve = resolve;
        });
      }

}
