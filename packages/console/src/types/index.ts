import { ReportDataMsgType } from '@monitor-sdk/types';

export interface ConsoleDataMsgType {
  args: any[];
  level: string;
}

export interface ConsoleMsgType extends ReportDataMsgType, ConsoleDataMsgType {}
