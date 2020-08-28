import AWS from 'aws-sdk';
export declare class MessageBus {
    constructor(awsRegion: string, snsTopicARN: string);
    snsInstance: AWS.SNS;
    topicARN: string;
    sendCommand(commandName: string, data: any): Promise<void>;
}
