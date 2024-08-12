import { IAnyObject, MethodTypes } from '@tc-track/types';
import { obj2query } from './base';


/**
 * 图片方式上传
 * @param {string} url - 接口地址
 * @param {IAnyObject} data - 请求参数
 */
export function imgRequest(url: string, data: IAnyObject): void {
    let img = new Image();
    const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
    img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
    img = null as any;
  }

  

/**
 * beacon函数用于发送beacon请求
 *
 * @param url - 请求的URL
 * @param data - 请求的数据
 * @returns 是否发送成功
 */
export function beacon(url: string, data: IAnyObject): boolean {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        // 这里做下判断，  formData.append的第二个参数只能接受string或者blob
        let value = data[key];
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        formData.append(key, value);
    });
    
    return navigator.sendBeacon(url, formData);
}

/**
 * xhr方式的 get 上传
 * @param {string} url - 接口地址
 * @param {IAnyObject} data - 请求参数
 * @return {Promise}
 */
export function get(url: string, data: IAnyObject): Promise<any> {
    return xhr(MethodTypes.GET, `${url}${url.indexOf('?') === -1 ? '?' : ''}${obj2query(data)}`, '');
}

/**
 * xhr方式的 post 上传
 * @param {string} url - 接口地址
 * @param {IAnyObject} data - 请求参数
 * @return {Promise}
 */
export function post(url: string, data: IAnyObject): Promise<any> {
    return xhr(MethodTypes.POST, url, obj2query(data));
  }
  
/**
 * 以xhr的方式发送HTTP请求
 *
 * @param method - HTTP请求方法
 * @param url - 请求URL
 * @param data - 请求数据
 * @returns 返回一个Promise对象，成功时解析为响应数据，失败时抛出错误
 */
export function xhr(method: MethodTypes, url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (method === MethodTypes.POST) {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(data);
            } else {
                xhr.send();
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    new Error(xhr.response);
                }
            };
        } catch (error) {
            reject(error);
        }
    });
}
