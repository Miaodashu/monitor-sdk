import { DomCollectedType } from './types/index';
import { BasePluginType, DomTypes, EventTypes, ReportDataMsgType, ReportDataType } from '@tc-track/types';
import { DomOptions } from './types';
import { formatDate, generateUUID, throttle } from '@tc-track/utils';
import { createDomRules } from './utils';

// dom 点击 事件  插件
export default function domPlugin(options: DomOptions = {}): BasePluginType {
    return {
        name: 'domPlugin',
        monitor(publish: (data: DomCollectedType) => void) {
            const { throttleDelayTime = 300 } = options;
            const clickThrottle = throttle(publish, throttleDelayTime);
            document.addEventListener(
                'click',
                function (e) {
                    clickThrottle({
                        category: DomTypes.CLICK,
                        data: e
                    });
                },
                true
            );
        },
        beforeReport(collectedData: DomCollectedType): ReportDataType<ReportDataMsgType> {
            const { category, data } = collectedData;
            if ((data.target as HTMLElement).tagName === 'BODY') {
                return;
            }
            const id = generateUUID();
            return {
                id,
                time: formatDate(),
                type: EventTypes.DOM,
                data: {
                    sub_type: category,
                    ...(createDomRules(data.target as HTMLElement) || {})
                }
            };
        }
    };
}
