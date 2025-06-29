import { describe, expect, test, vi } from 'vitest';

import { SmsSender } from './SmsSender.js';

vi.mock('twilio', () => ({
  default: vi.fn(() => ({
    messages: {
      create: vi.fn(
        ({ to }) =>
          new Promise((resolve, reject) => {
            if (!to) {
              reject('No number');
              return;
            }
            resolve({ status: 'yey' });
          })
      )
    }
  }))
}));

describe('SmsSender', () => {
  const logError = vi.fn();
  const logInfo = vi.fn();
  const commonConfig = {
    accountSid: '1234',
    fromNumber: '+12223334444',
    logger: {
      error: logError,
      info: logInfo
    },
    sid: '9999',
    secret: 'SeCrEt'
  };

  test('should work', async () => {
    const smsSender = new SmsSender({ ...commonConfig });
    await smsSender.sendSms({
      body: 'Test',
      recipients: ['', '+19991112223333']
    });
    expect(logError).toHaveBeenCalledWith(
      'Not a valid phone number to send SMS'
    );
    expect(logInfo).toHaveBeenCalledTimes(2);
    expect(logInfo).toHaveBeenCalledWith(
      'Trying to send SMS to number +19991112223333'
    );
    expect(logInfo).toHaveBeenCalledWith(
      'Sent SMS to number +19991112223333 successful (status yey)'
    );
  });

  test('should throw if no body is provided', async () => {
    const smsSender = new SmsSender({ ...commonConfig });
    await expect(
      smsSender.sendSms({
        body: '',
        recipients: ['+19991112223333']
      })
    ).rejects.toThrowError('No body to send SMS');
  });

  test('should throw if no recipients are provided', async () => {
    const smsSender = new SmsSender({ ...commonConfig });
    await expect(
      smsSender.sendSms({
        body: 'Test',
        recipients: []
      })
    ).rejects.toThrowError('No recipients to send SMS');
    await expect(
      smsSender.sendSms({
        body: 'Test',
        recipients: []
      })
    ).rejects.toThrowError('No recipients to send SMS');
  });

  describe('Message Scheduling', () => {
    test('should send scheduled SMS with valid future time', async () => {
      logError.mockClear();
      logInfo.mockClear();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const smsSender = new SmsSender({ ...commonConfig });

      await smsSender.sendSms({
        body: 'Scheduled test message',
        recipients: ['+19991112223333'],
        scheduledTime: futureTime.toISOString()
      });

      expect(logInfo).toHaveBeenCalledWith(
        'Trying to send SMS to number +19991112223333'
      );
    });

    test('should throw error for invalid scheduledTime format', async () => {
      const smsSender = new SmsSender({ ...commonConfig });

      await expect(
        smsSender.sendSms({
          body: 'Test',
          recipients: ['+19991112223333'],
          scheduledTime: 'invalid-date'
        })
      ).rejects.toThrowError('Invalid scheduledTime: Invalid date format');
    });

    test('should throw error for scheduledTime in the past', async () => {
      const pastTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const smsSender = new SmsSender({ ...commonConfig });

      await expect(
        smsSender.sendSms({
          body: 'Test',
          recipients: ['+19991112223333'],
          scheduledTime: pastTime.toISOString()
        })
      ).rejects.toThrowError(
        'Invalid scheduledTime: Scheduled time must be in the future'
      );
    });

    test('should throw error for scheduledTime more than 7 days in future', async () => {
      const tooFarFuture = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000); // 8 days from now
      const smsSender = new SmsSender({ ...commonConfig });

      await expect(
        smsSender.sendSms({
          body: 'Test',
          recipients: ['+19991112223333'],
          scheduledTime: tooFarFuture.toISOString()
        })
      ).rejects.toThrowError(
        'Invalid scheduledTime: Scheduled time cannot be more than 7 days in the future'
      );
    });

    test('should work without scheduledTime (immediate sending)', async () => {
      const smsSender = new SmsSender({ ...commonConfig });

      await smsSender.sendSms({
        body: 'Immediate test message',
        recipients: ['+19991112223333']
      });

      expect(logInfo).toHaveBeenCalledWith(
        'Trying to send SMS to number +19991112223333'
      );
    });

    test('should handle scheduled messages in sendMultipleSms', async () => {
      logError.mockClear();
      logInfo.mockClear();
      const futureTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const smsSender = new SmsSender({ ...commonConfig });

      await smsSender.sendMultipleSms([
        {
          body: 'Immediate message',
          recipients: ['+19991112223333']
        },
        {
          body: 'Scheduled message',
          recipients: ['+19991112223333'],
          scheduledTime: futureTime.toISOString()
        }
      ]);

      expect(logInfo).toHaveBeenCalledTimes(4); // 2 attempts + 2 successes
    });
  });
});
