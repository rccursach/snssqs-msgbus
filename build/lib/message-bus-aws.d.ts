import AWS from 'aws-sdk';
import { MessageBus } from './types';
export declare class MessageBusAWS extends MessageBus {
    constructor(awsRegion: string, snsTopicARN: string);
    snsInstance: AWS.SNS;
    topicARN: string;
    sendCommand(commandName: string, data: any): Promise<void>;
}
