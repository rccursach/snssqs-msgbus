"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBus = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
class MessageBus {
    constructor(awsRegion, snsTopicARN) {
        this.snsInstance = new aws_sdk_1.default.SNS({
            apiVersion: '2012-11-05',
            region: awsRegion,
        });
        this.topicARN = snsTopicARN;
    }
    async sendCommand(commandName, data) {
        if (commandName.match(/\b[A-Z][a-z]*([A-Z][a-z]*)*\b/g).length === 0) {
            throw new Error('commandName must be in PascalCase. Ex: DeliverEmail');
        }
        const originUuid = uuid_1.v4();
        try {
            const result = await this.snsInstance.publish({
                TargetArn: this.topicARN,
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
                Message: data
            }).promise();
            if (result.MessageId) {
                const r = result;
                console.log(`${commandName} with Attr originId: ${originUuid} successfully dispatched. MessageId: ${r.MessageId}.`);
            }
            else {
                const error = result;
                throw new Error(`Error dispatching message ${error.code} - ${error.message}`);
            }
        }
        catch (error) {
            console.error(`sendCommand: Error ${error.message}`, error);
        }
    }
}
exports.MessageBus = MessageBus;
//# sourceMappingURL=message-bus.js.map