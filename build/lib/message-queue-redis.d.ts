import { MessageSubPayload } from 'lib/types';
import * as NodeRedisPubsub from 'node-redis-pubsub';
import { MessageQueue, MessageQueueSub } from './types';
export declare class MessageQueueRedis extends MessageQueue {
    constructor(awsRegion: string);
    nrpInstance: typeof NodeRedisPubsub.default;
    subscriptions: Array<MessageQueueSub>;
    status: 'RUNNING' | 'STOPPED';
    timeoutHandler: any;
    _executeCallbackOnMessages(messages: MessageSubPayload[], subInfo: MessageQueueSub): Promise<void>;
    setSubs: () => void;
    stopSubs: () => void;
    loopFn: () => Promise<void>;
    run(): void;
    stop(): void;
}
