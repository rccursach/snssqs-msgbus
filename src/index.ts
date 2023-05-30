import { MessageBus, MessageQueue } from 'lib/types';
import { MessageBusAWS } from './lib/message-bus-aws';
import { MessageQueueAWS } from './lib/message-queue-aws';

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
  messageBus = new MessageBusAWS(awsRegion, snsTopicARN);
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
  messageQueue = new MessageQueueAWS(awsRegion);
  return messageQueue;
}

// Get the MessageQueue instance if any
export const getMessageQueue = (): MessageQueue => {
  return messageQueue;
}
