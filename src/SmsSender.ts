import twilio, { type Twilio } from 'twilio';
import type { GenericLogger, Message } from './types.js';

/**
 * Represents a service for sending SMS messages using Twilio.
 */
export class SmsSender {
  /** Twilio Account SID */
  private accountSid: string;

  /** Twilio client instance */
  private client: Twilio;

  /** Sender's phone number */
  private fromNumber: string;

  /** Logger for logging messages and errors */
  private logger: GenericLogger;

  /** Twilio SID */
  private sid: string;

  /** Twilio secret */
  private secret: string;

  /**
   * Creates an instance of SmsSender.
   * @param accountSid - Twilio Account SID.
   * @param fromNumber - Sender's phone number.
   * @param logger - Logger for logging messages and errors.
   * @param sid - Twilio SID.
   * @param secret - Twilio secret.
   */
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

  /**
   * Sends an SMS message to a list of recipients.
   * @param body - The content of the SMS message.
   * @param recipients - Array of recipient phone numbers.
   * @param scheduledTime - Optional ISO 8601 formatted date/time to schedule the message.
   * @throws Will throw an error if the body or recipients are empty.
   * @returns A promise that resolves to an array of sent message objects.
   */
  public async sendSms({ body, recipients, scheduledTime }: Message) {
    if (!body || body.length === 0) {
      throw new Error('No body to send SMS');
    }

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients to send SMS');
    }

    if (scheduledTime) {
      this.validateScheduledTime(scheduledTime);
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
          from: this.fromNumber,
          ...(scheduledTime && { sendAt: new Date(scheduledTime) })
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

  /**
   * Sends multiple SMS messages.
   * @param messages - Array of messages to send.
   * @returns A promise that resolves to an array of sent message objects.
   */
  public async sendMultipleSms(messages: Message[]) {
    return Promise.all(messages.map((message) => this.sendSms(message)));
  }

  /**
   * Validates the scheduled time format and ensures it's in the future.
   * @param scheduledTime - ISO 8601 formatted date/time string.
   * @throws Will throw an error if the format is invalid or time is in the past.
   */
  private validateScheduledTime(scheduledTime: string): void {
    try {
      const scheduledDate = new Date(scheduledTime);

      if (isNaN(scheduledDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const now = new Date();
      if (scheduledDate <= now) {
        throw new Error('Scheduled time must be in the future');
      }

      // Twilio allows scheduling up to 7 days in advance
      const maxFutureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (scheduledDate > maxFutureDate) {
        throw new Error(
          'Scheduled time cannot be more than 7 days in the future'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Invalid scheduledTime: ${error.message}`);
      }
      throw new Error(
        'Invalid scheduledTime format. Please use ISO 8601 format (e.g., 2024-01-01T12:00:00Z)'
      );
    }
  }
}
