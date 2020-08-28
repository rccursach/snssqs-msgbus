/* FIRST SETUP YOUR .env WITH THE FOLLOWING FIELDS:

AWS_REGION
AWS_SNS_ARN
QUEUE_NAME
QUEUE_URL
SNS_COMMAND_NAME

*/


import { config } from 'dotenv';
config();

const timestamp: number = Date.now();
const commandData = { hello: 'hello queue', timestamp: timestamp };
let received = false;

import { createMessageBus, getMessageBus, createMessageQueue, getMessageQueue } from '../build';

console.log(`TEST: will send a message with the timestamp: ${timestamp}`);

createMessageBus(process.env.AWS_REGION, process.env.AWS_SNS_ARN);
getMessageBus().sendCommand(process.env.SNS_COMMAND_NAME, JSON.stringify(commandData));

createMessageQueue(process.env.AWS_REGION);
getMessageQueue().addSubscription(process.env.QUEUE_NAME, process.env.QUEUE_URL, (messageId, messageBody) => {
  console.log(`Received a message with MessageId:${messageId} and body: ${messageBody}`);
  if (1 === 1) { throw new Error('Test error'); }
  if (String(messageBody).includes(String(timestamp))) {
    received = true;
  }
});
getMessageQueue().run();


setTimeout(() => {
  if (received) {
    console.log('\nTest Passed !');
    process.exit(0);
  } else {
    console.log('\nTest Failed !');
    process.exit(-1);
  }
}, 30000);
