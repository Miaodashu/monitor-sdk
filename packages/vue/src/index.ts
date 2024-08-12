import { BasePluginType, BrowserStackTypes, CallBack, ConsoleTypes, EventTypes, ReportDataType, StackQueueLevel, VueReportDataType } from "@tc-track/types";
import { VueOptions, VueTypes } from "./types";
import { generateUUID, formatDate } from "@tc-track/utils";

export default function vuePlugin(options: VueOptions = {}): BasePluginType {
    return {
        name: "vuePlugin",
        monitor(publish: (data: VueReportDataType) => void) {
            let { vue:vm} = options;
            let { debuge } = this.context
            if (!vm) {
                this.log('vuePlugin: 请传入vue实例');
                return;
            }
            const { errorHandler, silent } = vm.config;
            let that = this;
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
                  if (debuge) {
                    if (typeof errorHandler === 'function') {
                      (errorHandler as CallBack).call(this.vm, err, vm, info);
                    } else if (!silent) {
                      const message = `Error in ${info}: "${stack && stack.toString()}"`;
                      that.log(message, ConsoleTypes.ERROR);
                    }
                  }
              }
        },
        beforeReport(data: VueReportDataType): ReportDataType<VueReportDataType> {
            const id = generateUUID();
            return {
                id,
                time: formatDate(),
                type: EventTypes.VUE,
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