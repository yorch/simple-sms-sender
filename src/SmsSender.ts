import twilio, { type Twilio } from 'twilio';
import type { GenericLogger, Message } from './types.js';

export class SmsSender {
    private accountSid: string;
    private client: Twilio;
    private fromNumber: string;
    private logger: GenericLogger;
    private sid: string;
    private secret: string;

    constructor({
        accountSid,
        fromNumber,
        logger,
        sid,
        secret
    }: {
        accountSid: string;
        fromNumber: string;
        logger: GenericLogger;
        sid: string;
        secret: string;
    }) {
        this.accountSid = accountSid;
        this.logger = logger || {
            error: console.error.bind(console),
            info: console.log.bind(console)
        };
        this.fromNumber = fromNumber;
        this.sid = sid;
        this.secret = secret;

        this.client = twilio(this.sid, this.secret, {
            accountSid: this.accountSid
        });
    }

    public async sendSms({ body, recipients }: Message) {
        if (!body || body.length === 0) {
            throw new Error('No body to send SMS');
        }

        if (!recipients || recipients.length === 0) {
            throw new Error('No recipients to send SMS');
        }

        const sendSmsToNumber = async (phoneNumber?: string) => {
            const to = phoneNumber?.trim();

            if (!to) {
                this.logger.error('Not a valid phone number to send SMS');
                return;
            }

            this.logger.info(`Trying to send SMS to number ${phoneNumber}`);

            try {
                const message = await this.client.messages.create({
                    body,
                    to,
                    from: this.fromNumber
                });

                const { errorCode, errorMessage, status } = message;

                if (errorCode) {
                    this.logger.error(
                        `There was an error sending SMS to number ${phoneNumber} (${errorCode} - ${errorMessage})`
                    );
                } else {
                    this.logger.info(
                        `Sent SMS to number ${phoneNumber} successful (status ${status})`
                    );
                }

                return message;
            } catch (error) {
                this.logger.error(
                    `Could not send SMS to number '${phoneNumber}'`,
                    error
                );
            }

            return;
        };

        return Promise.all(recipients.map(sendSmsToNumber));
    }

    public async sendMultipleSms(messages: Message[]) {
        return Promise.all(messages.map(this.sendSms));
    }
}
