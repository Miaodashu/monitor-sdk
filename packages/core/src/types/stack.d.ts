
import { WxStackTypes, BrowserStackTypes, StackLevel } from './constant';

export type StackTypes = WxStackTypes | BrowserStackTypes | string;
export interface StackPushData {
    eventId: string;
    type: StackTypes;
    message: string;
    level?: StackLevel;
    time?: number;
}
