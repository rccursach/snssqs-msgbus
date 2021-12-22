import { MessageBus, MessageQueue } from 'lib/types';
import { MessageBusAWS } from './lib/message-bus';
import { MessageQueueAWS } from './lib/message-queue';
import { MessageBusRedis } from './lib/message-bus-redis';
import { MessageQueueRedis } from './lib/message-queue-redis';

let messageBus: MessageBus = undefined;
let messageQueue: MessageQueue = undefined;

/* This functions allows to handle a single instance of MessageBus and MessageQueue */


/* #### MessageBus #### */

// Creates a MessageBus instance and returns it
export const createMessageBus = (awsRegion: string, snsTopicARN: string): MessageBus => {
  if (messageBus !== undefined) {
    console.error('createMessageBus(): MessageBus instance is already defined');
    return messageBus;
  }
  if (process.env.REDIS_URL && String(process.env.MSGBUS_REDIS_MOCK).toUpperCase() === 'TRUE') {
    messageBus = new MessageBusRedis(awsRegion, snsTopicARN);
  } else {
    messageBus = new MessageBusAWS(awsRegion, snsTopicARN);
  }
  return messageBus;
}

// Get the MessageBus instance if any
export const getMessageBus = (): MessageBus => {
  return messageBus;
}


/* #### MessageQueue #### */

// Creates a MessageQueue instance and returns it
export const createMessageQueue = (awsRegion: string): MessageQueue => {
  if (messageQueue !== undefined) {
    console.error('createMessageQueue(): MessageQueue instance is already defined');
    return messageQueue;
  }
  if (process.env.REDIS_URL && String(process.env.MSGBUS_REDIS_MOCK).toUpperCase() === 'TRUE') {
    messageQueue = new MessageQueueRedis(awsRegion);
  }
  else {
    messageQueue = new MessageQueueAWS(awsRegion);
  }
  return messageQueue;
}

// Get the MessageQueue instance if any
export const getMessageQueue = (): MessageQueue => {
  return messageQueue;
}
