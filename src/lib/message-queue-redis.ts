import { MessageSubPayload } from 'lib/types';
import * as NodeRedisPubsub from 'node-redis-pubsub';
import { MessageQueue, MessageQueueSub } from './types';
import { parse as parseUrl } from 'url';
import LuckyCase from 'lucky-case';

export class MessageQueueRedis extends MessageQueue {
  constructor(awsRegion: string) {
    super(awsRegion);
    const url = process.env.REDIS_URL;
    this.nrpInstance = new NodeRedisPubsub.default({
      url: url,
    })

    this.status = 'STOPPED';
    this.timeoutHandler = undefined;
    this.subscriptions = [];

    console.log('Creating with redis (MessageQueueRedis)');
  }

  nrpInstance: typeof NodeRedisPubsub.default;
  subscriptions: Array<MessageQueueSub>;
  status: 'RUNNING' | 'STOPPED';
  timeoutHandler: any;

  // Execute message callbacks.
  // Try to run this in a contained way, to avoid breaking other running callbacks
  async _executeCallbackOnMessages(messages: MessageSubPayload[], subInfo: MessageQueueSub) {
    for (const m of messages) {
      try {
        console.log(`Processing ${m.MessageAttributes?.command?.StringValue || 'UndefinedCommand'}:${m.MessageAttributes?.originUuid?.StringValue || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`);
        // detect if callback is async and act accordingly
        if (subInfo.cb.constructor.name === "AsyncFunction") {
          await subInfo.cb(m.MessageId, m.Body, m.MessageAttributes);
        } else {
          subInfo.cb(m.MessageId, m.Body, m.MessageAttributes);
        }
        console.log(`Finished ${m.MessageAttributes?.command?.StringValue || 'UndefinedCommand'}:${m.MessageAttributes?.originUuid?.StringValue || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`);
      } catch (err) {
        console.error(`Error processing ${m.MessageAttributes?.command?.StringValue || 'UndefinedCommand'}:${m.MessageAttributes?.originUuid?.StringValue || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`, err);
      }
    }
  }

  // Set subscription callbacks for each running sub
  setSubs = () => {
    for (const s of this.subscriptions) {
      if (s.listenerHandler === undefined) {
        const pathElements = parseUrl(s.url).path.toString().split('/');
        const channel = LuckyCase.toSnakeCase(pathElements[pathElements.length -1]).toUpperCase();
        const unsubHandler = this.nrpInstance.subscribe(channel, (data: string, channel: string) => {
          const messages: MessageSubPayload[] = [JSON.parse(data) as MessageSubPayload];
          console.log(`received message`, messages);
          this._executeCallbackOnMessages(messages, s);
        }, () => {
          // console.log(`Subscribed to channel ${channel}`);
        });
        s.listenerHandler = unsubHandler;
      }
    }
  }

  // Stop subscription callbacks for each running sub
  stopSubs = () => {
    for (const s of this.subscriptions) {
      if (s.listenerHandler !== undefined) {
        s.listenerHandler();
        s.listenerHandler = undefined;
      }
    }
  }
  // This will run deferred inside a timeout callback in run()
  loopFn = async () => {
    setInterval(() => {
      if (this.status === 'RUNNING') {
        this.setSubs();
      }
    }, 1000);
  }

  // Run the queue subscriptions polling loop
  public run(): void {
    if (this.status === 'RUNNING') {
      throw new Error('Error: MessageQueue already running when calling run()');
    }
    // We will run loopFn in a deferred state thanks to the setTimeout callback
    // loopFn has an interlval that will skip when this.status !== 'RUNNING'
    this.status = 'RUNNING';
    this.timeoutHandler = setTimeout(this.loopFn, 1000);
  }

  // Stop the queue subscription polling loop.
  // It will stop on the next round.
  public stop(): void {
    if (this.status === 'STOPPED') {
      throw new Error('Error: MessageQueue already stoped when calling stop()');
    }
    clearTimeout(this.timeoutHandler);
    this.status = 'STOPPED';
    this.timeoutHandler = undefined;
    this.stopSubs();
  }
}
