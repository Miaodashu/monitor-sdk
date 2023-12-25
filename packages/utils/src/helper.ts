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
export const formatDate = (format = 'Y-M-D h:m:s', timestamp: number = Date.now()): string => {
    const date = new Date(timestamp || Date.now());
    const dateInfo = {
        Y: `${date.getFullYear()}`,
        M: `${date.getMonth() + 1}`,
        D: `${date.getDate()}`,
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };
    const formatNumber = (n) => (n >= 10 ? n : '0' + n);
    const res = (format || 'Y-M-D h:m:s')
        .replace('Y', dateInfo.Y)
        .replace('M', dateInfo.M)
        .replace('D', dateInfo.D)
        .replace('h', formatNumber(dateInfo.h))
        .replace('m', formatNumber(dateInfo.m))
        .replace('s', formatNumber(dateInfo.s));
    return res;
};
