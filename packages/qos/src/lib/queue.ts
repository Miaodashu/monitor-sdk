import { QosQueueItem } from "../types"

class QosQueue {
    queue: QosQueueItem[]
    processing: boolean
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    /**
     * 获取队列的长度
     */
    getLength() {
        return this.queue.length;
    }

    /**
     * 队列推一条消息
     * @param {*} item
     */
    push(item: QosQueueItem) {
        this.queue.push(item);
        this.processQueue();
    }

    /**
     * 内部方法，用于处理队列中的任务
     */
    async processQueue() {
        // 如果当前正在处理任务，则直接返回
        if (this.processing) {
            return;
        }

        // 如果队列为空，则不做处理
        if (this.getLength() === 0) {
            return;
        }

        this.processing = true;

        try {
            // 获取队列中的第一个任务
            const task = this.pop();
            if (task && task.startCallBack && typeof task.startCallBack === 'function') {
                // 执行任务
                await task.startCallBack(task.extendData);
            }
        } catch (error) {
            console.error('Task failed:', error);
        }

        this.processing = false;

        // 任务执行完毕后，递归调用以处理下一个任务
        this.processQueue();
    }

    /**
     * 出队列
     */
    pop() {
        return this.queue.shift();
    }

    getItems() {
        return this.queue || [];
    }
}

export default QosQueue;
