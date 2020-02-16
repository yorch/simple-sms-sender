import { SmsSender } from '../src/SmsSender';

jest.mock('twilio', () => () => ({
    messages: {
        create: jest.fn(
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
}));

describe('SmsSender', () => {
    const logError = jest.fn();
    const logInfo = jest.fn();
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
        const smsSender = new SmsSender(commonConfig);
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
});
