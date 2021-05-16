import twilio from 'twilio';
import Twilio from 'twilio/lib/rest/Twilio';

export class SmsSender {
    private accountSid: string;
    private client: Twilio;
    private fromNumber: string;
    private logger: any; // TODO: Give appropriate type
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
        logger: any;
        sid: string;
        secret: string;
    }) {
        this.accountSid = accountSid;
        this.logger = logger;
        this.fromNumber = fromNumber;
        this.sid = sid;
        this.secret = secret;

        this.client = twilio(this.sid, this.secret, {
            accountSid: this.accountSid
        });
    }

    public async sendSms({
        body,
        recipients
    }: {
        body: string;
        recipients: string[];
    }) {
        if (!body || body.length === 0) {
            throw new Error('No body to send SMS');
        }

        if (!recipients || recipients.length === 0) {
            throw new Error('No recipients to send SMS');
        }

        const sendSmsToNumber = (phoneNumber?: string) => {
            const to = phoneNumber.trim();
            if (!to) {
                this.logger.error('Not a valid phone number to send SMS');
                return;
            }
            this.logger.info(`Trying to send SMS to number ${phoneNumber}`);
            return this.client.messages
                .create({
                    body,
                    to,
                    from: this.fromNumber
                })
                .then((message) => {
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
                })
                .catch((error) => {
                    this.logger.error(
                        `Could not send SMS to number '${phoneNumber}'`,
                        error
                    );
                });
        };

        return Promise.all(recipients.map(sendSmsToNumber));
    }
}
