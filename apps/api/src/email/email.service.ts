import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface BookingEmailData {
  service: { name: string };
  client: { firstName: string; email: string };
  master: { firstName: string; email: string };
  startTime: Date;
  status?: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    this.logger.log(
      `SMTP config: host=${host ?? 'MISSING'} port=${port} user=${user ?? 'MISSING'} pass=${pass ? '***set***' : 'MISSING'} from=${from ?? 'MISSING'}`
    );

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true only for SSL port 465; port 587 uses STARTTLS
        requireTLS: port === 587,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP not configured — emails will only be logged to console. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.'
      );
    }
  }

  async onModuleInit() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      this.logger.log('✅ SMTP connection verified successfully');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ SMTP connection FAILED: ${msg}`, error instanceof Error ? error.stack : undefined);
    }
  }

  async sendNewBookingNotification(booking: BookingEmailData) {
    const dateStr = new Date(booking.startTime).toLocaleString('sk-SK');

    await this.sendMail(
      booking.master.email,
      `Nová rezervácia: ${booking.service.name}`,
      `Dobrý deň ${booking.master.firstName},\n\nMáte novú rezerváciu od ${booking.client.firstName} na službu "${booking.service.name}" dňa ${dateStr}.\n\nProsím prihláste sa a potvrďte alebo zamietnte rezerváciu.\n\nMajster.sk`
    );

    await this.sendMail(
      booking.client.email,
      `Rezervácia prijatá: ${booking.service.name}`,
      `Dobrý deň ${booking.client.firstName},\n\nVaša rezervácia na službu "${booking.service.name}" u majstra ${booking.master.firstName} dňa ${dateStr} bola odoslaná a čaká na potvrdenie.\n\nMajster.sk`
    );
  }

  async sendBookingStatusUpdate(booking: BookingEmailData) {
    const statusMap: Record<string, string> = {
      CONFIRMED: 'potvrdená',
      CANCELLED: 'zrušená',
      COMPLETED: 'dokončená',
    };
    const statusText = statusMap[booking.status ?? ''] ?? booking.status;

    await this.sendMail(
      booking.client.email,
      `Rezervácia ${statusText}: ${booking.service.name}`,
      `Dobrý deň ${booking.client.firstName},\n\nVaša rezervácia na službu "${booking.service.name}" dňa ${new Date(booking.startTime).toLocaleString('sk-SK')} bola ${statusText} majstrom ${booking.master.firstName}.\n\nMajster.sk`
    );
  }

  async sendPasswordResetEmail(to: string, firstName: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;
    await this.sendMail(
      to,
      'Obnovenie hesla — Majster.sk',
      `Dobrý deň ${firstName},\n\nPožiadali ste o obnovenie hesla. Kliknite na odkaz nižšie pre nastavenie nového hesla:\n\n${resetUrl}\n\nOdkaz je platný 1 hodinu. Ak ste o obnovenie nepožiadali, ignorujte tento email.\n\nMajster.sk`
    );
  }

  async sendWelcomeEmail(to: string, firstName: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    await this.sendMail(
      to,
      'Vitajte na Majster.sk! 🎉',
      `Dobrý deň ${firstName},\n\nVitajte na Majster.sk!\n\nVáš účet bol úspešne vytvorený cez Google. Môžete sa kedykoľvek prihlásiť pomocou tlačidla "Prihlásiť sa cez Google".\n\nČo môžete robiť:\n• Prehliadať majstrov a ich služby\n• Rezervovať termíny online\n• Sledovať stav vašich rezervácií\n\nZačnite hľadať: ${frontendUrl}/services\n\nMajster.sk — majster na všetky ruky`
    );
  }

  async sendTestEmail(to: string) {
    await this.sendMail(
      to,
      '✅ Test email — Majster.sk SMTP works!',
      `Tento email bol odoslaný z produkčného servera Majster.sk.\n\nSMTP konfigurácia funguje správne!\n\nČas odoslania: ${new Date().toISOString()}\n\nMajster.sk`
    );
  }

  async sendEmailVerification(to: string, firstName: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${token}`;
    await this.sendMail(
      to,
      'Overte váš email — Majster.sk',
      `Dobrý deň ${firstName},\n\nProsím overte vašu emailovú adresu kliknutím na odkaz nižšie:\n\n${verifyUrl}\n\nMajster.sk`
    );
  }

  private async sendMail(to: string, subject: string, text: string) {
    if (!this.transporter) {
      this.logger.log(`[DEV - no SMTP] Email to ${to} | Subject: ${subject}`);
      this.logger.debug(text);
      return;
    }

    const from = process.env.SMTP_FROM || 'noreply@majster.sk';
    this.logger.log(`Sending email to ${to} | Subject: ${subject} | From: ${from}`);

    try {
      const info = await this.transporter.sendMail({ from, to, subject, text });
      this.logger.log(`✅ Email sent to ${to} | MessageId: ${info.messageId}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Failed to send email to ${to}: ${msg}`, error instanceof Error ? error.stack : undefined);
    }
  }
}
