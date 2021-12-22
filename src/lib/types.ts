// Interface for message processing callbacks
export interface MessageQueueCallback { (messageId: string, messageBody: string, attributes?: any): void | Promise<void> };
export type MessageQueueSub = {
  url: string;
  cb: MessageQueueCallback;
  name: string;
  listenerHandler?: Function;
};

type BinaryData = string | Buffer | Uint8Array | Blob;
export interface MessageSubPayload {
  MessageId?: string;
  ReceiptHandle?: string;
  Body?: string;
  Attributes?: any;
  MessageAttributes?: {
    [key: string]: {
      StringValue?: string;
      BinaryValue?: BinaryData;
      StringListValues?: string[];
      BinaryListValues?: BinaryData[];
      DataType: string;
    }
  }
}

export abstract class  MessageBus {
  constructor(awsRegion: string, snsTopicARN: string) {}
  abstract sendCommand(commandName: string, data: any): Promise<any>;
}

export abstract class MessageQueue {
  constructor(awsRegion: string) { }

  subscriptions: Array<MessageQueueSub>;
  status: 'RUNNING' | 'STOPPED';

  // Execute message callbacks.
  // Try to run this in a contained way, to avoid breaking other running callbacks
  abstract _executeCallbackOnMessages(messages: AWS.SQS.MessageList | MessageSubPayload[], subInfo: MessageQueueSub) : Promise<any>

  // Run the queue subscriptions polling loop
  abstract run(): void

  // Stop the queue subscription polling loop.
  // It will stop on the next round.
  abstract stop(): void
  
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

  public getStatus(): 'RUNNING' | 'STOPPED' {
    return this.status;
  }
}
