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
} from '@tc-track/types';
import { formatDate, generateUUID, formatDecimal } from '@tc-track/utils';
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
            return {
                id: generateUUID(),
                time: formatDate(),
                type: EventTypes.PERFORMANCE,
                data: {
                  ...collectedData
                }
              };
        }
    };
}