"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageQueue = exports.createMessageQueue = exports.getMessageBus = exports.createMessageBus = void 0;
const message_bus_1 = require("./lib/message-bus");
const message_queue_1 = require("./lib/message-queue");
const message_bus_redis_1 = require("./lib/message-bus-redis");
const message_queue_redis_1 = require("./lib/message-queue-redis");
let messageBus = undefined;
let messageQueue = undefined;
const createMessageBus = (awsRegion, snsTopicARN) => {
    if (messageBus !== undefined) {
        console.error('createMessageBus(): MessageBus instance is already defined');
        return messageBus;
    }
    if (process.env.REDIS_URL && String(process.env.MSGBUS_REDIS_MOCK).toUpperCase() === 'TRUE') {
        messageBus = new message_bus_redis_1.MessageBusRedis(awsRegion, snsTopicARN);
    }
    else {
        messageBus = new message_bus_1.MessageBusAWS(awsRegion, snsTopicARN);
    }
    return messageBus;
};
exports.createMessageBus = createMessageBus;
const getMessageBus = () => {
    return messageBus;
};
exports.getMessageBus = getMessageBus;
const createMessageQueue = (awsRegion) => {
    if (messageQueue !== undefined) {
        console.error('createMessageQueue(): MessageQueue instance is already defined');
        return messageQueue;
    }
    if (process.env.REDIS_URL && String(process.env.MSGBUS_REDIS_MOCK).toUpperCase() === 'TRUE') {
        messageQueue = new message_queue_redis_1.MessageQueueRedis(awsRegion);
    }
    else {
        messageQueue = new message_queue_1.MessageQueueAWS(awsRegion);
    }
    return messageQueue;
};
exports.createMessageQueue = createMessageQueue;
const getMessageQueue = () => {
    return messageQueue;
};
exports.getMessageQueue = getMessageQueue;
//# sourceMappingURL=index.js.map