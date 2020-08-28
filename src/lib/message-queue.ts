import AWS from 'aws-sdk';

// Interface for message processing callbacks
export interface MessageQueueCallback { (messageId: string, messageBody: string, attributes?: any): void | Promise<void> };

type MessageQueueSub = {
  url: string;
  cb: MessageQueueCallback;
  name: string;
};

export class MessageQueue {
  constructor(awsRegion: string) {
    this.sqsInstance = new AWS.SQS({
      apiVersion: '2012-11-05',
      region: awsRegion,
    });
    this.status = 'STOPPED';
    this.timeoutHandler = undefined;
  }

  sqsInstance: AWS.SQS;
  subscriptions: Array<MessageQueueSub>;
  status: 'RUNNING' | 'STOPPED';
  timeoutHandler: any;

  // Execute message callbacks.
  // Try to run this in a contained way, to avoid breaking other running callbacks
  private async executeCallbackOnMessages(messages: AWS.SQS.MessageList, subInfo: MessageQueueSub) {
    for (const m of messages) {
      try {
        console.log(`Processing ${m.Attributes.command}:${m.Attributes.originUuid}. MessageId ${m.MessageId}`);
        // detect if callback is async and act accordingly
        if (subInfo.cb.constructor.name === "AsyncFunction") {
          await subInfo.cb(m.MessageId, m.Body, m.Attributes);
        } else {
          subInfo.cb(m.MessageId, m.Body, m.Attributes);
        }
        // Finally delete the message
        await this.sqsInstance.deleteMessage({
          ReceiptHandle: m.ReceiptHandle,
          QueueUrl: subInfo.url,
        }).promise();
        console.log(`Finished ${m.Attributes.command}:${m.Attributes.originUuid}. MessageId ${m.MessageId}`);
      } catch (err) {
        console.error(`Error processing ${m.Attributes.command}:${m.Attributes.originUuid}. MessageId ${m.MessageId}`, err);
      }
    }
  }

  // This will run deferred inside a timeout callback in run()
  loopFn = async () => {
    while (this.status === 'RUNNING') {
      // Poll a message for each subscription and wait
      const pollingPromises = [];
      for (const s of this.subscriptions) {
        const recvCall = this.sqsInstance.receiveMessage({
          QueueUrl: s.url,
          MaxNumberOfMessages: 1,
          VisibilityTimeout: 120,
          WaitTimeSeconds: 30,
          MessageAttributeNames: ['command', 'originUuid'],
        }).promise();
        pollingPromises.push(recvCall);
      }
      const pollingResults = await Promise.all(pollingPromises);

      // For each polling result execute its subscription callback without breaking the loop
      for (const [idx, r] of pollingResults.entries()) {
        // r is any of AWS.SQS.ReceiveMessageResult | AWS.AWSError
        if (r.Messages !== undefined) {
          const res = r as AWS.SQS.ReceiveMessageResult;
          await this.executeCallbackOnMessages(res.Messages, this.subscriptions[idx]);
        } else {
          const res = r as AWS.AWSError;
          console.error(`MessageQueue: Error while polling ${this.subscriptions[idx].name}. ${res.message}`, res);
        }
      }
    }
  }

  // Adds a queue url, a name and a function callback to process each message on arrival
  public addSubscription(name: string, queueURL: string, callback: MessageQueueCallback) {
    const exists = this.subscriptions.map(s => s.url).indexOf(queueURL) > -1;
    if (exists) {
      throw new Error(`Queue subscription already exists for ${queueURL}`);
    }
    this.subscriptions.push({
      url: queueURL,
      cb: callback,
      name: name,
    });
  }

  // Remove subscription. will take effect on the next loop round
  public removeSubscription(name: string) {
    const idx = this.subscriptions.map(s => s.name).indexOf(name);
    if (idx === -1) {
      throw new Error(`Queue sub '${name}' does not exists removing subscription.`);
    }
    this.subscriptions.splice(idx, 1);
  }

  // Run the queue subscriptions polling loop
  public run(): void {
    if (this.status === 'RUNNING') {
      throw new Error('Error: MessageQueue already running wen calling run()');
    }
    // We will run loopFn in a deferred state thanks to the setTimeout callback
    // loopFn has a while inside that will break when this.status !== 'RUNNING'
    this.status = 'RUNNING';
    this.timeoutHandler = setTimeout(this.loopFn, 1);
  }

  // Stop the queue subscription polling loop.
  // It will stop on the next round.
  public stop(): void {
    if (this.status === 'STOPPED') {
      throw new Error('Error: MessageQueue already stoped wen calling stop()');
    }
    clearTimeout(this.timeoutHandler);
    this.status = 'STOPPED';
    this.timeoutHandler = undefined;
  }

  public getStatus(): 'RUNNING' | 'STOPPED' {
    return this.status;
  }
}
