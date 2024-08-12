import { StackQueueLevel,  StackPushData } from '@tc-track/types';
// 创建一个栈结构进行 行为管理

export class Stack {
    private stacks: StackPushData[];
    constructor() {
        this.stacks = [];
    }

    // 添加一个任务到栈顶
    push(data: StackPushData) {
        if (!data.time) {
            data.time = new Date().getTime();
        }
        if (!data.level) {
            data.level = StackQueueLevel.INFO;
        }
        return this.stacks.push(data);
    }

    // 移除栈顶的元素，同时返回被移除的元素
    pop() {
        return this.stacks.pop();
    }

    // 返回栈顶的元素，不对栈做任何修改
    peek(): StackPushData {
        return this.stacks[this.stacks.length - 1];
    }

    isEmpty(): boolean {
        return this.stacks.length === 0;
    }

    size(): number {
        return this.stacks.length;
    }

    clear(): void {
        this.stacks = [];
    }

    // 获取堆栈存的任务集合
    getStacks(): StackPushData[] {
        return this.stacks.slice(0);
    }
}
