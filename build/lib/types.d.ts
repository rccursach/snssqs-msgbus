/// <reference types="node" />
export interface MessageQueueCallback {
    (messageId: string, messageBody: string, attributes?: any): void | Promise<void>;
}
export declare type MessageQueueSub = {
    url: string;
    cb: MessageQueueCallback;
    name: string;
    listenerHandler?: Function;
};
declare type BinaryData = string | Buffer | Uint8Array | Blob;
export interface MessageSubPayload {
    MessageId?: string;
    ReceiptHandle?: string;
    Body?: string;
    Attributes?: any;
    MessageAttributes?: {
        [key: string]: {
            StringValue?: string;
            BinaryValue?: BinaryData;
            StringListValues?: string[];
            BinaryListValues?: BinaryData[];
            DataType: string;
        };
    };
}
export declare abstract class MessageBus {
    constructor(awsRegion: string, snsTopicARN: string);
    abstract sendCommand(commandName: string, data: any): Promise<any>;
}
export declare abstract class MessageQueue {
    constructor(awsRegion: string);
    subscriptions: Array<MessageQueueSub>;
    status: 'RUNNING' | 'STOPPED';
    abstract _executeCallbackOnMessages(messages: AWS.SQS.MessageList | MessageSubPayload[], subInfo: MessageQueueSub): Promise<any>;
    abstract run(): void;
    abstract stop(): void;
    addSubscription(name: string, queueURL: string, callback: MessageQueueCallback): void;
    removeSubscription(name: string): void;
    getStatus(): 'RUNNING' | 'STOPPED';
}
export {};
