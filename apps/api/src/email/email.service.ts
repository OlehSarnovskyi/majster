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
    const dateStr = new Date(booking.startTime).toLocaleString();

    // Notify master
    await this.sendMail(
      booking.master.email,
      `New booking: ${booking.service.name}`,
      `Hello ${booking.master.firstName},\n\nYou have a new booking from ${booking.client.firstName} for "${booking.service.name}" on ${dateStr}.\n\nPlease log in to confirm or decline.\n\nMajster.sk`
    );

    // Notify client
    await this.sendMail(
      booking.client.email,
      `Booking confirmed: ${booking.service.name}`,
      `Hello ${booking.client.firstName},\n\nYour booking for "${booking.service.name}" with ${booking.master.firstName} on ${dateStr} has been submitted and is awaiting confirmation.\n\nMajster.sk`
    );
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

  async sendPasswordResetEmail(to: string, firstName: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
    await this.sendMail(
      to,
      'Password reset request — Majster.sk',
      `Hello ${firstName},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.\n\nMajster.sk`
    );
  }

  async sendEmailVerification(to: string, firstName: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
    await this.sendMail(
      to,
      'Verify your email — Majster.sk',
      `Hello ${firstName},\n\nPlease verify your email address by clicking the link below:\n\n${verifyUrl}\n\nMajster.sk`
    );
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
