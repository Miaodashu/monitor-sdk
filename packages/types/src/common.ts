export interface IAnyObject {
    [key: string]: any;
}

export type Recordable<T = any> = Record<string, T>;

export type CallBack = (...args: any[]) => void;
