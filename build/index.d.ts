import { MessageBus, MessageQueue } from 'lib/types';
export declare const createMessageBus: (awsRegion: string, snsTopicARN: string) => MessageBus;
export declare const getMessageBus: () => MessageBus;
export declare const createMessageQueue: (awsRegion: string) => MessageQueue;
export declare const getMessageQueue: () => MessageQueue;
