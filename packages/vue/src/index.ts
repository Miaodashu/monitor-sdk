import { BasePluginType, BrowserStackTypes, CallBack, ConsoleTypes, EventTypes, ReportDataType, StackQueueLevel, VueReportDataType } from "@monitor-sdk/types";
import { VueOptions, VueTypes } from "./types";
import { generateUUID, formatDate } from "@monitor-sdk/utils";

export default function vuePlugin(options: VueOptions = {}): BasePluginType {
    return {
        name: "vuePlugin",
        monitor(publish: (data: VueReportDataType) => void) {
            let { vue:vm} = options;
            let { debug } = this.context
            if (!vm) {
                this.log('vuePlugin: 请传入vue实例');
                return;
            }
            const { errorHandler, silent } = vm.config;
            vm.config.errorHandler = function (err, vm, info) {
                const { name, message, stack = '' } = err;
                publish({
                    name,
                    message,
                    hook: info,
                    stack,
                    sub_type: VueTypes.ERROR,
                    ...parseStack(stack)
                  });
                  if (debug) {
                    if (typeof errorHandler === 'function') {
                      (errorHandler as CallBack).call(this.vm, err, vm, info);
                    } else if (!silent) {
                      const message = `Error in ${info}: "${stack && stack.toString()}"`;
                      this.log(message, ConsoleTypes.ERROR);
                    }
                  }
              }
        },
        beforeReport(data: VueReportDataType): ReportDataType<VueReportDataType> {
            const id = generateUUID();
            // 添加用户行为栈
            const { hook, stack } = data;
            this.queue.enqueue({
                eventId: id,
                type: BrowserStackTypes.FRAMEWORK,
                level: StackQueueLevel.FATAL,
                message: `Error in Vue/n${hook}: "${stack && stack.toString()}"`
            })
            const queueList = this.queue.queueValue();

            return {
                time: formatDate(),
                type: EventTypes.VUE,
                queue: queueList,
                data
            };
        },
    }
}


function parseStack(stack: string) {
    const REG_EXP = /([a-z|0-9|-]*).js:[0-9]*:[0-9]*/;
    const [, sourceFile] = stack.split('\n');
    const [matched = ''] = REG_EXP.exec(sourceFile) || [];
    const [fileName, lineCol = ''] = matched.split('.js:');
    const [line, col] = lineCol.split(':');
    const lineno = Number(line);
    const colno = Number(col);
    if (!fileName || lineno !== lineno || colno !== colno) {
      return {};
    }
    return {
      lineno,
      colno,
      filename: `${fileName}.js`
    };
  }