/* FIRST SETUP YOUR .env WITH THE FOLLOWING FIELDS:

AWS_REGION
AWS_SNS_ARN
QUEUE_NAME
QUEUE_URL
SNS_COMMAND_NAME

*/

// Import libs
// import { config } from 'dotenv';
const { config } = require('dotenv');
config();

// import { createMessageBus, getMessageBus, createMessageQueue, getMessageQueue } from '../build';
const { createMessageBus, getMessageBus, createMessageQueue, getMessageQueue } = require ('../build');

// Setup test data
const timestamp = Date.now();
const commandData = { hello: 'hello queue', timestamp: timestamp };
let received = false;
console.log(`TEST: will send a message with the timestamp: ${timestamp}`);


// Setup bus and subscription
createMessageQueue(process.env.AWS_REGION);
createMessageBus(process.env.AWS_REGION, process.env.AWS_SNS_ARN);

// const setSubscription = (): Promise<void> => {
const setSubscription = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log('subscribing to queue');
      getMessageQueue().addSubscription(process.env.QUEUE_NAME, process.env.QUEUE_URL, (messageId, messageBody) => {
        console.log(`Received a message with MessageId:${messageId} and body: ${messageBody}`);
        if (process.env.FAIL_TEST) { throw new Error('Test error'); }
        if (String(messageBody).includes(String(timestamp))) {
          received = true;
        }
      });
      getMessageQueue().run();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// const setCommand = (): Promise<void> => {
const setCommand = () => {
  return new Promise((resolve, reject) => {
    try {
      // wait at least 5 seconds before sending the message
      setTimeout(() => {
        console.log('sending command');
        getMessageBus().sendCommand(process.env.SNS_COMMAND_NAME, JSON.stringify(commandData));
        resolve();
      }, 5000);
    } catch (err) {
      reject(err);
    }
  });
}

// TEST
// Chain setSubscription -> setCommand -> test values after 10 seconds

setSubscription().then(() => {
  return setCommand();
}).then(() => {
  setTimeout(() => {
    if (received) {
      console.log('\nTest Passed !');
      process.exit(0);
    } else {
      console.log('\nTest Failed !');
      process.exit(-1);
    }
  }, 10000);
});
