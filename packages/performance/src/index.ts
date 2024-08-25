import { PerformanceFeat, PerformanceOptions } from './types/index';
import {
    BasePluginType,
    PerTypes,
    ConsoleTypes,
    EventTypes,
    ReportDataType,
    BrowserErrorTypes,
    BrowserStackTypes,
    StackQueueLevel,
    ReportDataMsgType
} from '@monitor-sdk/types';
import { formatDate, generateUUID, formatDecimal } from '@monitor-sdk/utils';
import getBasic from './lib/basic';
import getResources from './lib/resources';

interface CollectedType {
    sub_type: PerTypes;
    value: any;
}

export default function performance(options: PerformanceOptions = {}): BasePluginType {
    const { performancOff = [] } = options;
    return {
        name: 'performancePlugin',
        monitor(publish: (data: CollectedType) => void) {
            window.addEventListener('load', () => {
                if (!performancOff.includes(PerformanceFeat.BASIC)) {
                    publish({
                        sub_type: PerTypes.BASIC,
                        value: getBasic()
                    });
                }
                if (!performancOff.includes(PerformanceFeat.RESOURCE)) {
                    publish({
                        sub_type: PerTypes.RESOURCE,
                        value: getResources()
                    });
                }
            });
        },
        beforeReport(collectedData: CollectedType): ReportDataType<CollectedType> {
            if (collectedData.sub_type === PerTypes.RESOURCE) {
                return {
                    st: formatDate(),
                    type: EventTypes.PERFORMANCE,
                    datas: collectedData.value,
                    data: {
                        ...collectedData
                    }
                };
            } else {
                return {
                    st: formatDate(),
                    type: EventTypes.PERFORMANCE,
                    data: {
                        ...collectedData
                    }
                };
            }
        }
    };
}
