import { Recordable } from '@monitor-sdk/types';
import { MinimatchOptions, minimatch } from 'minimatch';

/**
 * 生成UUID
 * @return {string}  {string}
 */
export function generateUUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

/**
 * 格式化日期时间
 * @param {string} format
 * @param {number} timestamp - 时间戳
 * @return {string}
 */
export const formatDate = (format = 'YYYY-MM-DD hh:mm:ss', timestamp: number = Date.now()): string => {
    const date = new Date(timestamp || Date.now());
    const formatNumber = (n) => (n >= 10 ? n : '0' + n);

    const dateInfo = {
        YYYY: date.getFullYear().toString(), // 获取完整年份
        YY: date.getFullYear().toString().slice(-2), // 获取年份的后两位
        MM: formatNumber(date.getMonth() + 1),
        DD: formatNumber(date.getDate()),
        hh: formatNumber(date.getHours()),
        mm: formatNumber(date.getMinutes()),
        ss: formatNumber(date.getSeconds())
    };
    
    
    const res = (format || 'YYYY-MM-DD hh:mm:ss')
        .replace('YYYY', dateInfo.YYYY)
        .replace('MM', dateInfo.MM)
        .replace('DD', dateInfo.DD)
        .replace('hh', dateInfo.hh)
        .replace('mm', dateInfo.mm)
        .replace('ss', dateInfo.ss);
    
    return res;
};

/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {Recordable} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(source: Recordable, name: string, replacement: (...args: any[]) => any, isForced?: boolean): void {
    if (source === undefined) return;
    if (name in source || isForced) {
        const original = source[name];
        const wrapped = replacement(original);
        if (typeof wrapped === 'function') {
            source[name] = wrapped;
        }
    }
}

/**
 * 保留指定位数的小数
 * @param num 原数据
 * @param decimal 小数位数
 * @returns
 */
export function formatDecimal(num: number, decimal: number): number {
    if (!num) {
        return num;
    }
    let str = num.toString();
    const index = str.indexOf('.');
    if (index !== -1) {
        str = str.substring(0, decimal + index + 1);
    } else {
        str = str.substring(0);
    }
    return parseFloat(str);
}


export function minimatchFn(p: string, pattern: string, options?: MinimatchOptions) {
    return minimatch(p, pattern, options);
}
