# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Build the project (includes type checking):

```bash
yarn build
```

Run tests:

```bash
yarn test           # Single run
yarn test:watch     # Watch mode
yarn test:coverage  # With coverage report
```

Type checking and linting:

```bash
yarn check      # TypeScript type checking only
yarn lint       # ESLint check
yarn lint:fix   # ESLint with auto-fix
```

Full validation (lint + test + build):

```bash
yarn full
```

Clean build artifacts:

```bash
yarn clean
```

## Architecture

This is a TypeScript library for sending SMS messages via Twilio. The codebase is structured as follows:

- **Core class**: `SmsSender` in `src/SmsSender.ts` - Main service class that wraps Twilio client
- **Types**: `src/types.ts` - Contains type definitions for `Message` and `GenericLogger`
- **Entry point**: `src/index.ts` - Exports the main `SmsSender` class
- **Tests**: `src/SmsSender.test.ts` - Unit tests using Vitest with Twilio client mocking

### Key Design Patterns

- **Constructor injection**: SmsSender accepts Twilio credentials and optional logger
- **Promise-based API**: All SMS operations return promises for async handling
- **Batch operations**: Supports sending single SMS or multiple SMS messages
- **Message scheduling**: Schedule SMS delivery up to 7 days in advance using ISO 8601 timestamps
- **Error handling**: Graceful handling of invalid phone numbers and Twilio API errors
- **Input validation**: Validates message content, recipients, and scheduled time formats
- **Logging abstraction**: Uses `GenericLogger` interface (defaults to console if not provided)

### Twilio Integration

The SmsSender class initializes a Twilio client using:

- `accountSid`: Twilio Account SID
- `sid`: Twilio SID (used for authentication)
- `secret`: Twilio Auth Token
- `fromNumber`: Sender's phone number

## Code Style

- **TypeScript**: Strict mode enabled with `@tsconfig/strictest`
- **ESLint**: Configured with TypeScript and Prettier rules
- **Formatting**: Prettier with 2-space indentation, single quotes, semicolons
- **Testing**: Vitest with mocking for external dependencies
- **Build**: tsup for bundling (outputs CJS and ESM formats)
- **Package manager**: Yarn (v4.9.2)

## Testing

Tests use Vitest and mock the Twilio client. The test suite covers:

- Constructor validation
- SMS sending success/failure scenarios
- Multiple recipient handling
- Error conditions (empty body, no recipients, invalid numbers)
- Logger integration

## Release Process

Uses Release Please with conventional commits. To release:

```bash
git commit --allow-empty -m "chore: release {version}" -m "Release-As: {version}"
```
