import { formatDecimal } from "@monitor-sdk/utils";

interface responseStatusType {
  responseStatus?: number
}
export default function () {
  return performance.getEntriesByType('resource').map((item: PerformanceResourceTiming & responseStatusType) => ({
      name: item.name,
      initiatorType: item.initiatorType,
      responseStatus: item.responseStatus,
      time: formatDecimal(item.responseEnd, 3)
  }));
}
