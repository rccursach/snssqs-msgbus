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
exports.MessageBusRedis = void 0;
const uuid_1 = require("uuid");
const NodeRedisPubsub = __importStar(require("node-redis-pubsub"));
const types_1 = require("./types");
const lucky_case_1 = __importDefault(require("lucky-case"));
class MessageBusRedis extends types_1.MessageBus {
    constructor(awsRegion, snsTopicARN) {
        super(awsRegion, snsTopicARN);
        const url = process.env.REDIS_URL;
        this.nrpInstance = NodeRedisPubsub.default({
            url: url,
        });
        this.topicARN = snsTopicARN;
        console.log('Creating with redis (MessageBusRedis)');
    }
    async sendCommand(commandName, data) {
        if (commandName.match(/\b[A-Z][a-z]*([A-Z][a-z]*)*\b/g).length === 0) {
            throw new Error('commandName must be in PascalCase. Ex: DeliverEmail');
        }
        const originUuid = (0, uuid_1.v4)();
        try {
            const channel = lucky_case_1.default.toSnakeCase(commandName).toUpperCase();
            console.log(`publishing on channel ${channel}`);
            const messagePayload = {
                MessageAttributes: {
                    'command': {
                        DataType: 'String',
                        StringValue: commandName,
                    },
                    'originUuid': {
                        DataType: 'String',
                        StringValue: originUuid,
                    },
                },
                Body: data,
                MessageId: originUuid,
            };
            this.nrpInstance.publish(channel, JSON.stringify(messagePayload));
            console.log(`${commandName} with Attr originId: ${originUuid} successfully dispatched. MessageId: ${messagePayload.MessageId}.`);
        }
        catch (error) {
            console.error(`sendCommand: Error ${error.message}`, error);
        }
    }
}
exports.MessageBusRedis = MessageBusRedis;
//# sourceMappingURL=message-bus-redis.js.map