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
});
