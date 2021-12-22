# Mock queue with a redis pub/sub

For development without connecting to an SNS and SQS instance, the env vars
`REDIS_URL` and `MSGBUS_REDIS_MOCK` can be used to fallback to a Redis pub/sub mock implementation

This is pub/sub, not a queue, and any messages not consumed by a client will be lost.
also `at-lest-once` or `exactly-once` are not possible.

Neither are possible delayed messages, or visibility of the message.

What's sent is delivered, and _ALL_ the subscribed instances will receive the same messages. 

_The env vars needed are:_

* `REDIS_URL` Must be a properly structured Redis URL (IE: _`redis://127.0.0.1:6379`_)
* `MSGBUS_REDIS_MOCK` String value representing the boolean value `'True'` (case insensitive)


# From `queues` to `channels`

## Sending a command

Sending a command will publish the payload on a channel named "like" the command's name,
but in uppercased snake-case.

IE:
```javascript
createMessageBus(process.env.AWS_REGION, process.env.AWS_SNS_ARN);
const commandData = { status: 'DELAYED', reason: 'We ran short on vegan peperoni' };

getMessageBus().sendCommand('PizzaDeliveryStatusUpdate', JSON.stringify(commandData));
```
Will Publish data on the channel `PIZZA_DELIVERY_STATUS_UPDATE`.

## Subscribing to a command Queue

Subscribing to a command queue will listen to events on the channel
_*named like the path*_ of the queue URL, but in uppercased snake-case.

IE:

```BASH
PIZZA_DELIVERY_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/111223344556/PizzaDeliveryStatusUpdate
```

```javascript
createMessageQueue(process.env.AWS_REGION);
getMessageQueue().addSubscription('MyCommandName', process.env.PIZZA_DELIVERY_QUEUE_URL, (messageId, messageBody) => {
  console.log(`Received a message with MessageId:${messageId} and body: ${messageBody}`);
});
```

Will listen on the channel `PIZZA_DELIVERY_STATUS_UPDATE`.