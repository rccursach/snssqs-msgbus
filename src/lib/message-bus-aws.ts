import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { MessageBus } from './types';

export class MessageBusAWS extends MessageBus {
  constructor(awsRegion: string, snsTopicARN: string) {
    super(awsRegion, snsTopicARN);
    let ep: AWS.Endpoint;
    const options = {
      apiVersion: '2012-11-05',
      region: awsRegion,
    };
    if (process.env.AWS_ENDPOINT_URL || process.env.AWS_ENDPOINT_SNS_URL) {
      ep = new AWS.Endpoint(process.env.AWS_ENDPOINT_URL || process.env.AWS_ENDPOINT_SNS_URL);
      options['endpoint'] = ep;
    }
    this.snsInstance = new AWS.SNS(options);
    this.topicARN = snsTopicARN;
    // Set logger for debug
    if (process.env.DEBUG && String(process.env.DEBUG).toLowerCase() === 'true') {
      console.log('MessageBus: AWS logger set to console');
      AWS.config.logger = console;
    }
  }
  snsInstance: AWS.SNS;
  topicARN: string;

  public async sendCommand(commandName: string, data: any) {
    if (commandName.match(/\b[A-Z][a-z]*([A-Z][a-z]*)*\b/g).length === 0) {
      throw new Error('commandName must be in PascalCase. Ex: DeliverEmail');
    }
    const originUuid = v4(); // Not 100% sure if needed
    try {
      const result: AWS.SNS.PublishResponse | AWS.AWSError = await this.snsInstance.publish({
        TargetArn: this.topicARN,
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
        Message: data
      }).promise();
      
      if (result.MessageId) {
        const r = result as AWS.SNS.PublishResponse;
        console.log(`${commandName} with Attr originId: ${originUuid} successfully dispatched. MessageId: ${r.MessageId}.`);
      } else {
        const error = result as AWS.AWSError;
        throw new Error(`Error dispatching message ${error.code} - ${error.message}`);
      }
    } catch (error) {
      console.error(`sendCommand: Error ${error.message}`, error);
    }
  }
}
