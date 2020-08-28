"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageQueue = exports.createMessageQueue = exports.getMessageBus = exports.createMessageBus = void 0;
const message_bus_1 = require("./lib/message-bus");
const message_queue_1 = require("./lib/message-queue");
let messageBus = undefined;
let messageQueue = undefined;
exports.createMessageBus = (awsRegion, snsTopicARN) => {
    if (messageBus !== undefined) {
        console.error('createMessageBus(): MessageBus instance is already defined');
        return messageBus;
    }
    messageBus = new message_bus_1.MessageBus(awsRegion, snsTopicARN);
    return messageBus;
};
exports.getMessageBus = () => {
    return messageBus;
};
exports.createMessageQueue = (awsRegion) => {
    if (messageQueue !== undefined) {
        console.error('createMessageQueue(): MessageQueue instance is already defined');
        return messageQueue;
    }
    messageQueue = new message_queue_1.MessageQueue(awsRegion);
    return messageQueue;
};
exports.getMessageQueue = () => {
    return messageQueue;
};
//# sourceMappingURL=index.js.map