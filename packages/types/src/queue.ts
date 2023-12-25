


import { BrowserStackTypes, StackQueueLevel } from './constant';

export type QueueTypes = BrowserStackTypes | string;


export interface QueueData {
    eventId: string;
    type: QueueTypes;
    message: string;
    level?: StackQueueLevel;
    time?: number;
}