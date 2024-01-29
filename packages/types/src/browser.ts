import { ReportDataMsgType } from "./base";

export interface RouteDataMsgType {
    from: string;
    to: string;
}

export interface RouteMsgType extends ReportDataMsgType, RouteDataMsgType {}