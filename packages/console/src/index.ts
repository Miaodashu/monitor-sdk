import { formatDate, generateUUID, replaceOld } from '@monitor-sdk/utils';
import { ConsoleDataMsgType, ConsoleMsgType } from './types/index';
import { BasePluginType, BrowserStackTypes, EventTypes, ReportDataType } from '@monitor-sdk/types';

export default function consolePlugin(): BasePluginType {
    // 不监听console.debug的输出， 因为sdk内部log方法使用的时候console.debug， 监控ta的话会死循环
    const logType = ['log', 'info', 'warn', 'error', 'assert'];
    return {
        name: 'consolePlugin',
        monitor(publish: (data: ConsoleDataMsgType) => void) {
            if (!window.console) {
                return;
            }
            const { debuge } = this.context;
            logType.forEach((level) => {
                replaceOld(window.console, level, (originFn) => {
                    return function (...args: any[]): void {
                        if (originFn) {
                            publish({
                                args,
                                level
                            });
                            if (debuge) {
                                originFn.apply(window.console, args);
                            }
                        }
                    };
                });
            });
        },
        beforeReport(collectedData: ConsoleDataMsgType): ReportDataType<ConsoleMsgType> {
            const id = generateUUID();
            // this.queue.enqueue({
            //     eventId: id,
            //     type: BrowserStackTypes.CONSOLE,
            //     level
            // });
            return {
                id,
                type: EventTypes.CONSOLE,
                time: formatDate(),
                data: {
                    sub_type: collectedData.level,
                    ...collectedData
                }
            };
        }
    };
}
