import { formatDecimal } from "@monitor-sdk/utils";

export default function () {
  return performance.getEntriesByType('resource').map((item: PerformanceResourceTiming) => ({
    name: item.name,
    time: formatDecimal(item.responseEnd, 3)
  }));
}
