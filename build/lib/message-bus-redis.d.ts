import * as NodeRedisPubsub from 'node-redis-pubsub';
import { MessageBus } from './types';
export declare class MessageBusRedis extends MessageBus {
    constructor(awsRegion: string, snsTopicARN: string);
    nrpInstance: typeof NodeRedisPubsub.default;
    topicARN: string;
    sendCommand(commandName: string, data: any): Promise<void>;
}
