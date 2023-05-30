"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueue = exports.MessageBus = void 0;
;
class MessageBus {
    constructor(awsRegion, snsTopicARN) { }
}
exports.MessageBus = MessageBus;
class MessageQueue {
    constructor(awsRegion) { }
    addSubscription(name, queueURL, callback) {
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
    removeSubscription(name) {
        const idx = this.subscriptions.map(s => s.name).indexOf(name);
        if (idx === -1) {
            throw new Error(`Queue sub '${name}' does not exists removing subscription.`);
        }
        this.subscriptions.splice(idx, 1);
    }
    getStatus() {
        return this.status;
    }
}
exports.MessageQueue = MessageQueue;
//# sourceMappingURL=types.js.map