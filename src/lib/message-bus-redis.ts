import { v4 } from 'uuid';
import * as NodeRedisPubsub from 'node-redis-pubsub';
import { MessageBus } from './types';
import LuckyCase from 'lucky-case';

export class MessageBusRedis extends MessageBus {
  constructor(awsRegion: string, snsTopicARN: string) {
    super(awsRegion, snsTopicARN);
    const url = process.env.REDIS_URL;
    this.nrpInstance = NodeRedisPubsub.default({
      url: url,
    })
    this.topicARN = snsTopicARN;
    console.log('Creating with redis (MessageBusRedis)');
  }
  // snsInstance: AWS.SNS;
  nrpInstance: typeof NodeRedisPubsub.default;
  topicARN: string;

  public async sendCommand(commandName: string, data: any) {
    if (commandName.match(/\b[A-Z][a-z]*([A-Z][a-z]*)*\b/g).length === 0) {
      throw new Error('commandName must be in PascalCase. Ex: DeliverEmail');
    }
    const originUuid = v4(); // Not 100% sure if needed
    try {
      // Make upper snake case from command as a channel name -> IE: ReportAwesomeEvent => REPORT_AWESOME_EVENT
      const channel = LuckyCase.toSnakeCase(commandName).toUpperCase();
      console.log(`publishing on channel ${channel}`);
      const messagePayload = {
        MessageAttributes: {
          'command': {
            DataType: 'String',
            StringValue: commandName,
          },
          'originUuid': {
            DataType: 'String',
            StringValue: originUuid as string,
          },
        },
        Body: data,
        MessageId: originUuid as string,
      };
      this.nrpInstance.publish(channel, JSON.stringify(messagePayload));
      console.log(`${commandName} with Attr originId: ${originUuid} successfully dispatched. MessageId: ${messagePayload.MessageId}.`);
    } catch (error) {
        console.error(`sendCommand: Error ${error.message}`, error);
    }
  }
}
