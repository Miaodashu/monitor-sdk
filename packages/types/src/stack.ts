
import { BrowserStackTypes, StackQueueLevel } from './constant';

export type StackTypes =  BrowserStackTypes | string;

export interface StackPushData {
    eventId: string;
    type: StackTypes;
    message: string;
    level?: StackQueueLevel;
    time?: number;
}
