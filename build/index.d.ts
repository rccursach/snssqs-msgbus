import { MessageBus } from './lib/message-bus';
import { MessageQueue } from './lib/message-queue';
export declare const createMessageBus: (awsRegion: string, snsTopicARN: string) => MessageBus;
export declare const getMessageBus: () => MessageBus;
export declare const createMessageQueue: (awsRegion: string) => MessageQueue;
export declare const getMessageQueue: () => MessageQueue;
