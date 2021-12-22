import AWS from 'aws-sdk';
import { MessageQueue, MessageQueueSub } from './types';
export declare class MessageQueueAWS extends MessageQueue {
    constructor(awsRegion: string);
    sqsInstance: AWS.SQS;
    subscriptions: Array<MessageQueueSub>;
    status: 'RUNNING' | 'STOPPED';
    timeoutHandler: any;
    _executeCallbackOnMessages(messages: AWS.SQS.MessageList, subInfo: MessageQueueSub): Promise<void>;
    loopFn: () => Promise<void>;
    run(): void;
    stop(): void;
}
