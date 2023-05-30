"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBusAWS = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const types_1 = require("./types");
class MessageBusAWS extends types_1.MessageBus {
    constructor(awsRegion, snsTopicARN) {
        super(awsRegion, snsTopicARN);
        let ep;
        const options = {
            apiVersion: '2012-11-05',
            region: awsRegion,
        };
        if (process.env.AWS_ENDPOINT_URL || process.env.AWS_ENDPOINT_SNS_URL) {
            ep = new aws_sdk_1.default.Endpoint(process.env.AWS_ENDPOINT_URL || process.env.AWS_ENDPOINT_SNS_URL);
            options['endpoint'] = ep;
        }
        this.snsInstance = new aws_sdk_1.default.SNS(options);
        this.topicARN = snsTopicARN;
        if (process.env.DEBUG && String(process.env.DEBUG).toLowerCase() === 'true') {
            console.log('MessageBus: AWS logger set to console');
            aws_sdk_1.default.config.logger = console;
        }
    }
    async sendCommand(commandName, data) {
        if (commandName.match(/\b[A-Z][a-z]*([A-Z][a-z]*)*\b/g).length === 0) {
            throw new Error('commandName must be in PascalCase. Ex: DeliverEmail');
        }
        const originUuid = (0, uuid_1.v4)();
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
exports.MessageBusAWS = MessageBusAWS;
//# sourceMappingURL=message-bus-aws.js.map