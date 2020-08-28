# SNSSQS-MSGBUS

A message bus using AWS SNS Topics and SQS Queues

## Install

npm
```bash
$ npm install snssqs-msgbus
```

yarn
```bash
$ yarn add snssqs-msgbus
```

## AWS Setup:

1) Create SNS `Topic_X`
2) Create a SQS `Queue_Y`

3) On SNS Topic_X:

* Add subscription with `Queue_Y`'s ARN

* On subscription filter policy add

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
  "Id": "Policy1598555915016",
  "Statement": [
    {
      "Sid": "Stmt1598555833949",
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
      "Sid": "Stmt1598555909044",
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
and restricts sending messages only be from thhis SNS topic._
* _The second defines who can receive messages from the Queue. (Adjust principal as needed to control access)_

_(Without the first Statement messages will NOT arrive to the queue)_

