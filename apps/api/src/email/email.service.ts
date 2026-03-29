import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface BookingEmailData {
  service: { name: string };
  client: { firstName: string; email: string };
  master: { firstName: string; email: string };
  startTime: Date;
  status?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendNewBookingNotification(booking: BookingEmailData) {
    const subject = `New booking: ${booking.service.name}`;
    const text = `Hello ${booking.master.firstName},\n\nYou have a new booking from ${booking.client.firstName} for "${booking.service.name}" on ${new Date(booking.startTime).toLocaleString()}.\n\nPlease log in to confirm or decline.\n\nMajster.sk`;

    await this.sendMail(booking.master.email, subject, text);
  }

  async sendBookingStatusUpdate(booking: BookingEmailData) {
    const statusText =
      booking.status === 'CONFIRMED'
        ? 'confirmed'
        : booking.status === 'CANCELLED'
          ? 'cancelled'
          : 'completed';

    const subject = `Booking ${statusText}: ${booking.service.name}`;
    const text = `Hello ${booking.client.firstName},\n\nYour booking for "${booking.service.name}" on ${new Date(booking.startTime).toLocaleString()} has been ${statusText} by ${booking.master.firstName}.\n\nMajster.sk`;

    await this.sendMail(booking.client.email, subject, text);
  }

  private async sendMail(to: string, subject: string, text: string) {
    if (!this.transporter) {
      this.logger.log(`[DEV] Email to ${to}: ${subject}`);
      this.logger.debug(text);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@majster.sk',
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }
}
