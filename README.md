# SNSSQS-MSGBUS

A message bus using AWS SNS Topics and SQS Queues


___
## Install


npm
```bash
$ npm install snssqs-msgbus
```

yarn
```bash
$ yarn add snssqs-msgbus
```


___
## Usage


This lib provides two classes, `MessageBus` and `MessageQueue`. MessageBus will send command messages (AWS SNS), while
MessageQueue will gather messages from a queue (AWS SQS).

_Both `MessageBus` and `MessageQueue` will retrieve credentials from the [Default credentials chain](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)._


___
## Redis local mock (Not for production)


For rapid development, a Redis backed mock can be used. It is not queued based, but a pub/sub,
So any messages not consumed by a client will be lost, and `at-lest-once` or `exactly-once` are not possible.

See: [REDIS_MOCK](./REDIS_MOCK.md)


___
## MessageBus


Send messages to services through SNS Topic.

```javascript
import { createMessageBus, getMessageBus } from 'snssqs-msgbus';
// Provide the region ans SNS ARN
const msgBus = createMessageBus(process.env.AWS_REGION, process.env.AWS_SNS_ARN);

// the MessageBus instance can be reached from msgBus and also from
// getMessageBus(), which will return the previously created MessageBus instance.

// ...

// Somewhere in your code
const commandData = { whatheverContent: 1, someValue: 'this string' };

getMessageBus().sendCommand('PascalCasedCommandName', JSON.stringify(commandData));

// This will send a SNS message with Attribute command=PascalCasedCommandName and MessageBody=commandData
```


___
## MessageQueue


Receive commands and data from a SQS Queue.

```javascript
import { createMessageQueue, getMessageQueue } from 'snssqs-msgbus';

// Create the MesssageQueue instance
createMessageQueue(process.env.AWS_REGION);

// Create a subscription to a Queue.
// First arg is for logging purposes only
// Then provide Queue URL and callback. If callback is async, it will be awaited.
getMessageQueue().addSubscription('MyCommandName', process.env.MY_CMD_QUEUE_URL, (messageId, messageBody) => {
  console.log(`Received a message with MessageId:${messageId} and body: ${messageBody}`);
});

// To start polling queues invoke run()
getMessageQueue().run();

// It can be stopped also with getMessageQueue().stop();
```


___
## AWS Setup:


1) Create SNS `Topic_X`
2) Create a SQS `Queue_Y`

3) On SNS Topic_X:

* Add subscription with `Queue_Y`'s ARN

* Select `Enable raw message delivery` (it __MUST BE SELECTED__ !) 

* On subscription filter policy add this (which commands will enter the queue)

```json
{
  "command": [
    "CommandName"
  ]
}
```
Where "CommandName" is the identifier to route an operation notification to certain queue.
(command is a sns notification attribute, not a field on message body)

4) On SQS Queues > `Queue_Y`


* Select Access Policy, and edit with the following Policy

```json
{
  "Version": "2012-10-17",
  "Id": "Policy1598555915018",
  "Statement": [
    {
      "Sid": "Stmt1598555833567",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "<QUEUE_Y_ARN>",
      "Condition": {
        "StringEquals": {
          "aws:SourceArn": "<TOPIC_X_ARN>"
        }
      }
    },
    {
      "Sid": "Stmt1598555909987",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "sqs:ChangeMessageVisibility",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes",
        "sqs:GetQueueUrl",
        "sqs:ReceiveMessage"
      ],
      "Resource": "<QUEUE_Y_ARN>"
    }
  ]
}
```

* _The first statement allows SNS to send messages to the queue,
and restricts sending messages only be from this SNS topic._
* _The second defines who can receive messages from the Queue. (Adjust principal as needed to control access)_

_(Without the first Statement messages will NOT arrive to the queue)_

