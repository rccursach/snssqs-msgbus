"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueAWS = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const types_1 = require("./types");
class MessageQueueAWS extends types_1.MessageQueue {
    constructor(awsRegion) {
        super(awsRegion);
        this.loopFn = async () => {
            while (this.status === 'RUNNING') {
                const pollingPromises = [];
                for (const s of this.subscriptions) {
                    const recvCall = this.sqsInstance.receiveMessage({
                        QueueUrl: s.url,
                        MaxNumberOfMessages: 1,
                        VisibilityTimeout: 120,
                        WaitTimeSeconds: 20,
                        MessageAttributeNames: ['command', 'originUuid'],
                    }).promise();
                    pollingPromises.push(recvCall);
                }
                const pollingResults = await Promise.all(pollingPromises);
                for (const [idx, r] of pollingResults.entries()) {
                    if (r.retryable !== undefined) {
                        const res = r;
                        console.error(`MessageQueue: Error while polling ${this.subscriptions[idx].name}. ${res.message}`, res);
                    }
                    else if (r.Messages !== undefined) {
                        const res = r;
                        console.log(`received message`, res.Messages);
                        await this._executeCallbackOnMessages(res.Messages, this.subscriptions[idx]);
                    }
                }
            }
        };
        this.sqsInstance = new aws_sdk_1.default.SQS({
            apiVersion: '2012-11-05',
            region: awsRegion,
        });
        this.status = 'STOPPED';
        this.timeoutHandler = undefined;
        this.subscriptions = [];
        if (process.env.DEBUG && String(process.env.DEBUG).toLowerCase() === 'true') {
            console.log('MessageQueue: AWS logger set to console');
            aws_sdk_1.default.config.logger = console;
        }
    }
    async _executeCallbackOnMessages(messages, subInfo) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        for (const m of messages) {
            try {
                console.log(`Processing ${((_b = (_a = m.MessageAttributes) === null || _a === void 0 ? void 0 : _a.command) === null || _b === void 0 ? void 0 : _b.StringValue) || 'UndefinedCommand'}:${((_d = (_c = m.MessageAttributes) === null || _c === void 0 ? void 0 : _c.originUuid) === null || _d === void 0 ? void 0 : _d.StringValue) || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`);
                if (subInfo.cb.constructor.name === "AsyncFunction") {
                    await subInfo.cb(m.MessageId, m.Body, m.MessageAttributes);
                }
                else {
                    subInfo.cb(m.MessageId, m.Body, m.MessageAttributes);
                }
                await this.sqsInstance.deleteMessage({
                    ReceiptHandle: m.ReceiptHandle,
                    QueueUrl: subInfo.url,
                }).promise();
                console.log(`Finished ${((_f = (_e = m.MessageAttributes) === null || _e === void 0 ? void 0 : _e.command) === null || _f === void 0 ? void 0 : _f.StringValue) || 'UndefinedCommand'}:${((_h = (_g = m.MessageAttributes) === null || _g === void 0 ? void 0 : _g.originUuid) === null || _h === void 0 ? void 0 : _h.StringValue) || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`);
            }
            catch (err) {
                console.error(`Error processing ${((_k = (_j = m.MessageAttributes) === null || _j === void 0 ? void 0 : _j.command) === null || _k === void 0 ? void 0 : _k.StringValue) || 'UndefinedCommand'}:${((_m = (_l = m.MessageAttributes) === null || _l === void 0 ? void 0 : _l.originUuid) === null || _m === void 0 ? void 0 : _m.StringValue) || 'UndefinedOriginUuid'}. MessageId ${m.MessageId}`, err);
            }
        }
    }
    run() {
        if (this.status === 'RUNNING') {
            throw new Error('Error: MessageQueue already running when calling run()');
        }
        this.status = 'RUNNING';
        this.timeoutHandler = setTimeout(this.loopFn, 1);
    }
    stop() {
        if (this.status === 'STOPPED') {
            throw new Error('Error: MessageQueue already stoped when calling stop()');
        }
        clearTimeout(this.timeoutHandler);
        this.status = 'STOPPED';
        this.timeoutHandler = undefined;
    }
}
exports.MessageQueueAWS = MessageQueueAWS;
//# sourceMappingURL=message-queue-aws.js.map