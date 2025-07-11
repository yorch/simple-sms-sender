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
    accountSid: '', // string, required
    fromNumber: '', // string, required
    logger, // Logger instance, optional, defaults to console
    secret: '', // string, required
    sid: '' // string, required
});

// Returns a promise
sender.sendSms({
    body: '', // string
    recipients: [], // array of strings
    scheduledTime: '' // optional ISO 8601 date string
});

sender.sendMultipleSms([
    { body: '', recipients: [] },
    { body: '', recipients: [], scheduledTime: '' }
]);
```

## Example

```js
import { SmsSender } from 'simple-sms-sender';
import pino from 'pino';

const logger = pino();

const config = {
    accountSid: '{Your Twilio Account SID}',
    fromNumber: '{Phone number to send}',
    secret: '{Your Twilio Secret}',
    sid: '{Your Twilio SID}'
};

const createSender = () => {
    const { accountSid, fromNumber, secret, sid } = config;

    return new SmsSender({
        accountSid,
        fromNumber,
        logger, // optional
        secret,
        sid
    });
};

const smsSender = createSender();

smsSender.sendMultipleSms([
    {
        body: 'Some message',
        recipients: ['+19999999999', '+18888888888']
    },
    {
        body: 'Some other message',
        recipients: ['+19999999999']
    },
    {
        body: 'Scheduled message',
        recipients: ['+19999999999'],
        scheduledTime: '2024-12-25T10:00:00Z' // Send on Christmas at 10 AM UTC
    }
]);
```

## Features

- Integration with Twilio API for SMS sending.
- Batch SMS sending to multiple recipients.
- **Message scheduling** - Schedule SMS messages up to 7 days in advance.
- Customizable logging with support for external logger instances.
- TypeScript support for type safety.

## Prerequisites

Before using this library, ensure you have:

- A Twilio account.
- Twilio Account SID, Auth Token (Secret), and SID.
- A phone number registered with Twilio for sending SMS.

## API

### `SmsSender` constructor

| Parameter  | Type          | Required | Description                          |
| ---------- | ------------- | -------- | ------------------------------------ |
| accountSid | string        | Yes      | Twilio Account SID                   |
| fromNumber | string        | Yes      | Phone number to send from            |
| logger     | GenericLogger | No       | Logger instance, defaults to console |
| secret     | string        | Yes      | Twilio Auth Token (Secret)           |
| sid        | string        | Yes      | Twilio SID                           |

### Methods

#### `sendSms({ body, recipients, scheduledTime })`

- `body`: string (required) — Message text
- `recipients`: string[] (required) — List of phone numbers
- `scheduledTime`: string (optional) — ISO 8601 formatted date/time to schedule message delivery (up to 7 days in advance)
- Returns: `Promise<any[]>`

#### `sendMultipleSms(messages)`

- `messages`: Array<{ body: string, recipients: string[], scheduledTime?: string }>
- Returns: `Promise<any[]>`

## Message Scheduling

You can schedule SMS messages to be sent at a future time using the `scheduledTime` parameter:

```js
// Schedule a message for 1 hour from now
const futureTime = new Date(Date.now() + 60 * 60 * 1000);
smsSender.sendSms({
    body: 'This message will be sent in 1 hour',
    recipients: ['+19999999999'],
    scheduledTime: futureTime.toISOString()
});

// Schedule a message for a specific date/time
smsSender.sendSms({
    body: 'Happy New Year!',
    recipients: ['+19999999999'],
    scheduledTime: '2024-01-01T00:00:00Z'
});
```

**Scheduling Rules:**
- Time must be in ISO 8601 format (e.g., `2024-01-01T12:00:00Z`)
- Time must be in the future
- Maximum scheduling window is 7 days in advance
- Invalid formats or times will throw validation errors

## Logger

- The `logger` parameter is optional. If not provided, logs will use `console.log` and `console.error`.
- Logger must implement `{ info: (...args) => void, error: (...args) => void }`.

## Error Handling

### Example

```js
smsSender.sendSms({
    body: 'Hello!',
    recipients: ['+19999999999']
}).catch(error => {
    console.error('Failed to send SMS:', error);
});

smsSender.sendMultipleSms([
    { body: 'Message 1', recipients: ['+19999999999'] },
    { body: 'Message 2', recipients: ['+18888888888'] }
]).catch(error => {
    console.error('Failed to send multiple SMS:', error);
});
```

## Additional Resources

- [Twilio Documentation](https://www.twilio.com/docs) for more details on Twilio API.

## Testing

To run tests:

```sh
yarn test
```

## Release Management

Release versions follow [Semantic Versioning](https://semver.org/).

To release a new version, ensure all tests pass and lint the code, then, make and push an empty commit like:

```sh
git commit --allow-empty -m "chore: release {release}" -m "Release-As: {release}"
# For example:
git commit --allow-empty -m "chore: release 0.3.0" -m "Release-As: 0.3.0"
```

Release Please will automatically detect the commit message and create a new release based on the `Release-As` tag.

## Code Style & Linting

See [CODE_STYLE.md](./CODE_STYLE.md) for code style guidelines.

To lint the code:

```sh
yarn lint
```

## Security

See [SECURITY.md](./SECURITY.md) for security policy and how to report vulnerabilities.

## Contributing

Contributions are welcome! Please open issues or pull requests.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
