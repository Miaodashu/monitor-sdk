import { DomTypes } from '@monitor-sdk/types';

export interface DomCollectedType {
    category: DomTypes;
    data: Event;
}

export interface DomOptions {
    throttleDelayTime?: number;
}
