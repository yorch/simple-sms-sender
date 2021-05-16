# Simple SMS Sender [![Build Status](https://travis-ci.org/yorch/simple-sms-sender.svg?branch=master)](https://travis-ci.org/yorch/simple-sms-sender) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=yorch/simple-sms-sender)](https://dependabot.com)

Library to send SMS messages to multiple recipients using Twilio API.

## Usage

```js
import { SmsSender } from 'simple-sms-sender';

const sender = new SmsSender({
  accountId: '', // string
  fromNumber: '', // string
  logger, // Logger instance, optional, defaults to console.log and console.error
  secret: '', // string
  sid: '', // string
});

// Returns a promise
sender.sendSms({
  body: '', // string
  recipients: [] // array of strings
})
```

## Example

```js
import { SmsSender } from 'simple-sms-sender';

const config = {
  accountSid: '{Your Twilio Account SID}',
  fromNumber: '{Phone number to send }',
  secret: '{Your Twilio Secret}',
  sid: '{Your Twilio SID}'
};

const logger = {
  info: (...args) => console.log(...args),
  error: (...args) => console.error(...args)
};

const sendSms = ({ body, recipients }) => {
  const {
      accountSid, fromNumber, secret, sid,
  } = config;

  const smsSender = new SmsSender({
    accountSid,
    fromNumber,
    logger,
    secret,
    sid,
  });

  return smsSender.sendSms({
      body,
      recipients,
  });
};

Promise.all([
  sendSms({
    body: 'Some message',
    recipients: ['+19999999999', '+18888888888']
  }),
  sendSms({
    body: 'Some other message message',
    recipients: ['+19999999999']
  })
]);
```
