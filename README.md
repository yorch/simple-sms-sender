# Simple SMS Sender [![Build Status](https://travis-ci.org/yorch/simple-sms-sender.svg?branch=master)](https://travis-ci.org/yorch/simple-sms-sender) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=yorch/simple-sms-sender)](https://dependabot.com)

Library to send SMS messages to multiple recipients using Twilio API.

## Example

```js
const config = {
  accountSid: '{Your Twilio Account SID}',
  from: '{Phone number to send }',
  secret: '{Your Twilio Secret}',
  sid: '{Your Twilio SID}'
};

const logger = {
  info: (...args) => console.log(...args),
  error: (...args) => console.error(...args)
};

const sendSms = ({ body, recipients }) => {
  const {
      accountSid, from, secret, sid,
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
