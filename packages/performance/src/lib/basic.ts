// 获取基础性能数据
import { formatDecimal } from '@monitor-sdk/utils';

interface BasicType {
    dnsSearch: number; // DNS 解析耗时
    tcpConnect: number; // TCP 连接耗时
    sslConnect: number; // SSL安全连接耗时
    request: number; // TTFB 网络请求耗时
    response: number; // 数据传输耗时
    parseDomTree: number; // DOM 解析耗时
    resource: number; // 资源加载耗时
    domReady: number; // DOM Ready
    httpHead: number; // http 头部大小
    interactive: number; // 首次可交互时间
    complete: number; // 页面完全加载
    redirect: number; // 重定向次数
    redirectTime: number; // 重定向耗时
    duration: number; // 资源请求的总耗时 responseEnd-startTime
    fp: number; // 渲染出第一个像素点，白屏时间
    fcp: number; // 渲染出第一个内容，首屏结束时间
  }
export default function getBasic(): BasicType {
    const {
        domainLookupEnd,
        domainLookupStart,
        connectEnd,
        connectStart,
        secureConnectionStart,
        loadEventStart,
        domInteractive,
        domContentLoadedEventEnd,
        duration,
        responseStart,
        requestStart,
        responseEnd,
        fetchStart,
        transferSize,
        encodedBodySize,
        redirectEnd,
        redirectStart,
        redirectCount
    } = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;;
    const { startTime: fp } = performance.getEntriesByType('paint').find(({ name }) => name === 'first-paint') || {};
    const { startTime: fcp } = performance.getEntriesByType('paint').find(({ name }) => name === 'first-contentful-paint') || {};
    return {
        // DNS 解析耗时
        dnsSearch: formatDecimal(domainLookupEnd - domainLookupStart, 3),
        // TCP 连接耗时
        tcpConnect: formatDecimal(connectEnd - connectStart, 3),
        //   SSL安全连接耗时
        sslConnect: formatDecimal(connectEnd - secureConnectionStart, 3),
        // TTFB 网络请求耗时
        request: formatDecimal(responseStart - requestStart, 3),
        //   数据传输耗时
        response: formatDecimal(responseEnd - responseStart, 3),
        //   DOM 解析耗时
        parseDomTree: formatDecimal(domInteractive - responseEnd, 3),
        // 资源加载耗时
        resource: formatDecimal(loadEventStart - domContentLoadedEventEnd, 3),
        // DOM Ready
        domReady: formatDecimal(domContentLoadedEventEnd - fetchStart, 3),
        // 首次可交互时间
        interactive: formatDecimal(domInteractive - fetchStart, 3),
        //   页面完全加载
        complete: formatDecimal(loadEventStart - fetchStart, 3),
        //   http 头部大小
        httpHead: formatDecimal(transferSize - encodedBodySize, 3),
        // 重定向次数
        redirect: formatDecimal(redirectCount, 3),
        // 重定向耗时
        redirectTime: formatDecimal(redirectEnd - redirectStart, 3),
        //   资源请求的总耗时 responseEnd-startTime
        duration: formatDecimal(duration, 3),
        // 渲染出第一个像素点，白屏时间
        fp: formatDecimal(fp, 3),
        // 渲染出第一个内容，首屏结束时间
        fcp: formatDecimal(fcp, 3)
    };
}
