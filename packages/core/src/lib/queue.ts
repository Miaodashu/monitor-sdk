// 创建一个队列结构进行 行为管理

import { BaseOptionsType, QueueData, Recordable } from "@monitor-sdk/types";

export class Queue<O extends BaseOptionsType> {
    private readonly maxQueueLength: number
    private queue: Recordable
    private count: number;
    private lowestCount: number;
    constructor(options: Partial<O> = {}) {
        this.count = 0;
        this.lowestCount = 0
        this.queue = {}
        this.maxQueueLength = options?.maxQueueLength || 200;
    }
    // 向队列尾部添加一个新的项。
    enqueue(data: QueueData) {
        if (this.size() >= this.maxQueueLength) {
            this.dequeue()
        }
        this.queue[this.count] = data
        this.count ++
    }
    // 移除队列的第一项（即排在队列最前面的项）并返回被移除的元素
    dequeue() {
        if (this.isEmpty()) {
            return 
        }
        let result = this.queue[this.lowestCount]
        delete this.queue[this.lowestCount]
        this.lowestCount++
        return result
    }

    // 返回队列中第一个元素 不移除元素，只返回元素
    peek() {
        if (this.isEmpty()) {
            return 
        }
        return this.queue[this.lowestCount]
    }
    
    // 队列任务是否为空
    isEmpty(): boolean {
        return this.count - this.lowestCount === 0;
    }

    // 队列包含的任务个数
    size(): number {
        return this.count - this.lowestCount;
    }

    // 获取队列中存储的任务集合
    queueValue(): QueueData[] {
        if (this.isEmpty()) {
            return []
        }
        return Object.values(this.queue)
    }
}