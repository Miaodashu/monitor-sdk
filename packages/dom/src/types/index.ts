import { DomTypes } from '@tc-track/types';

export interface DomCollectedType {
    category: DomTypes;
    data: Event;
}

export interface DomOptions {
    throttleDelayTime?: number;
}
