import { CallBack } from '@tc-track/types'
export class PubSub {
    private events: Map<string, CallBack[]> = new Map();

    hasEvent(event: string) {
        return this.events.has(event)
    }
    subscribe(event: string, callback: CallBack) {
        if (!this.hasEvent(event)) {
            this.events.set(event, [])
        }
        this.events.get(event)?.push(callback);
    }

    publish<T = any>(event: string, data: T) {
        if (!this.hasEvent(event)) {
            return;
        }

        this.events.get(event)?.forEach((callback) => {
            callback(data);
        });
    }

    unsubscribe(event: string, callback: CallBack) {
        if (!this.hasEvent(event)) {
            return;
        }
        const currentCallbacks = this.events.get(event)
        let index = currentCallbacks?.indexOf(callback)
        if (index !== -1) {
            currentCallbacks?.splice(index as number, 1)
        }
    }
}