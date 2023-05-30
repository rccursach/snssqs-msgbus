"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageQueue = exports.createMessageQueue = exports.getMessageBus = exports.createMessageBus = void 0;
const message_bus_aws_1 = require("./lib/message-bus-aws");
const message_queue_aws_1 = require("./lib/message-queue-aws");
let messageBus = undefined;
let messageQueue = undefined;
const createMessageBus = (awsRegion, snsTopicARN) => {
    if (messageBus !== undefined) {
        console.error('createMessageBus(): MessageBus instance is already defined');
        return messageBus;
    }
    messageBus = new message_bus_aws_1.MessageBusAWS(awsRegion, snsTopicARN);
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
    messageQueue = new message_queue_aws_1.MessageQueueAWS(awsRegion);
    return messageQueue;
};
exports.createMessageQueue = createMessageQueue;
const getMessageQueue = () => {
    return messageQueue;
};
exports.getMessageQueue = getMessageQueue;
//# sourceMappingURL=index.js.map