import { ReportDataMsgType } from "@monitor-sdk/types";

export enum RecordTypes {
  SESSION = 'session'
}

export interface RecordDataType {
  events: any[] | string;
}

export interface RecordMsgType extends ReportDataMsgType, RecordDataType {}
