# Simple SMS Sender

Library to send SMS messages to multiple recipients using Twilio API.

[![install size](https://packagephobia.com/badge?p=simple-sms-sender)](https://packagephobia.com/result?p=simple-sms-sender)
[![Typescript](https://flat.badgen.net/badge/icon/included?icon=typescript&label)](https://unpkg.com/browse/simple-sms-sender/dist/index.d.ts)
[![Known Vulnerabilities](https://snyk.io/test/github/yorch/simple-sms-sender/badge.svg)](https://snyk.io/test/github/yorch/simple-sms-sender)

## Installation

```sh
yarn add simple-sms-sender
```

or

```sh
npm install --save simple-sms-sender
```

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
import pino from 'pino';

const logger = pino();

const config = {
  accountSid: '{Your Twilio Account SID}',
  fromNumber: '{Phone number to send }',
  secret: '{Your Twilio Secret}',
  sid: '{Your Twilio SID}'
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
