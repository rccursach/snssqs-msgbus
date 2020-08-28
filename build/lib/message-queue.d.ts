import AWS from 'aws-sdk';
export interface MessageQueueCallback {
    (messageId: string, messageBody: string, attributes?: any): void | Promise<void>;
}
declare type MessageQueueSub = {
    url: string;
    cb: MessageQueueCallback;
    name: string;
};
export declare class MessageQueue {
    constructor(awsRegion: string);
    sqsInstance: AWS.SQS;
    subscriptions: Array<MessageQueueSub>;
    status: 'RUNNING' | 'STOPPED';
    timeoutHandler: any;
    private executeCallbackOnMessages;
    loopFn: () => Promise<void>;
    addSubscription(name: string, queueURL: string, callback: MessageQueueCallback): void;
    removeSubscription(name: string): void;
    run(): void;
    stop(): void;
    getStatus(): 'RUNNING' | 'STOPPED';
}
export {};
