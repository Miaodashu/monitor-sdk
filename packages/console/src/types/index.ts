import { ReportDataMsgType } from '@tc-track/types';

export interface ConsoleDataMsgType {
  args: any[];
  level: string;
}

export interface ConsoleMsgType extends ReportDataMsgType, ConsoleDataMsgType {}
