import { formatDate, formatDecimal } from "@monitor-sdk/utils";

interface responseStatusType {
  responseStatus?: number
}
export default function () {
  return performance.getEntriesByType('resource').map((entry: PerformanceResourceTiming & responseStatusType) => ({
      name: entry.name, // 资源名称
      url: entry.name, // 资源名称
      sourceType: entry.initiatorType, // 资源类型
      st: formatDate(),
      extend: {
        duration: formatDecimal(entry.duration, 3), // 资源加载耗时
        dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 耗时
        tcp: entry.connectEnd - entry.connectStart, // 建立 tcp 连接耗时
        redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
        ttfb: entry.responseStart, // 首字节时间
        protocol: entry.nextHopProtocol, // 请求协议
        responseBodySize: entry.encodedBodySize, // 响应内容大小
        responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
        resourceSize: entry.decodedBodySize, // 资源解压后的大小
        isCache: isCache(entry), // 是否命中缓存
        startTime: performance.now(),
      }
  }));
}

function isCache(entry) {
    // 直接从缓存读取或 304
    return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
}