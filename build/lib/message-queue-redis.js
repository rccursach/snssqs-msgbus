"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueRedis = void 0;
const NodeRedisPubsub = __importStar(require("node-redis-pubsub"));
const types_1 = require("./types");
const url_1 = require("url");
const lucky_case_1 = __importDefault(require("lucky-case"));
class MessageQueueRedis extends types_1.MessageQueue {
    constructor(awsRegion) {
        super(awsRegion);
        this.setSubs = () => {
            for (const s of this.subscriptions) {
                if (s.listenerHandler === undefined) {
                    const pathElements = (0, url_1.parse)(s.url).path.toString().split('/');
                    const channel = lucky_case_1.default.toSnakeCase(pathElements[pathElements.length - 1]).toUpperCase();
                    const unsubHandler = this.nrpInstance.subscribe(channel, (data, channel) => {
                        const messages = [JSON.parse(data)];
                        console.log(`received message`, messages);
                        this._executeCallbackOnMessages(messages, s);
                    }, () => {
                    });
                    s.listenerHandler = unsubHandler;
                }
            }
        };
        this.stopSubs = () => {
            for (const s of this.subscriptions) {
                if (s.listenerHandler !== undefined) {
                    s.listenerHandler();
                    s.listenerHandler = undefined;
                }
            }
        };
        this.loopFn = async () => {
            setInterval(() => {
                if (this.status === 'RUNNING') {
                    this.setSubs();
                }
            }, 1000);
        };
        const url = process.env.REDIS_URL;
        this.nrpInstance = new NodeRedisPubsub.default({
            url: url,
        });
        this.status = 'STOPPED';
        this.timeoutHandler = undefined;
        this.subscriptions = [];
        console.log('Creating with redis (MessageQueueRedis)');
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
        this.timeoutHandler = setTimeout(this.loopFn, 1000);
    }
    stop() {
        if (this.status === 'STOPPED') {
            throw new Error('Error: MessageQueue already stoped when calling stop()');
        }
        clearTimeout(this.timeoutHandler);
        this.status = 'STOPPED';
        this.timeoutHandler = undefined;
        this.stopSubs();
    }
}
exports.MessageQueueRedis = MessageQueueRedis;
//# sourceMappingURL=message-queue-redis.js.map