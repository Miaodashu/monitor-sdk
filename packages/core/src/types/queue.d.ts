
import { WxStackTypes, BrowserStackTypes, StackLevel } from './constant';

export type StackTypes = WxStackTypes | BrowserStackTypes | string;


export interface QueueData {
    eventId: string;
    type: StackTypes;
    message: string;
    level?: StackLevel;
    time?: number;
}