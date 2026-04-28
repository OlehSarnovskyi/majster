import { Controller, Get, Query, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService, HealthCheckResponse } from './app.service';
import { EmailService } from '../email/email.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get('health')
  @SkipThrottle()
  getHealth(): HealthCheckResponse {
    return this.appService.getHealth();
  }

  /**
   * Test Brevo email delivery. Call with ?to=your@email.com
   * Example: GET /api/health/email?to=you@gmail.com
   * Protected by a shared secret — set HEALTH_SECRET env var, pass as ?secret=...
   */
  @Get('health/email')
  @SkipThrottle()
  async testEmail(@Query('to') to: string, @Query('secret') secret: string) {
    const expectedSecret = process.env.HEALTH_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      return { ok: false, error: 'Unauthorized — wrong or missing ?secret=' };
    }

    if (!to) {
      return { ok: false, error: 'Missing ?to= query param. Usage: /api/health/email?to=you@email.com' };
    }

    this.logger.log(`Brevo email test requested → sending to ${to}`);

    try {
      await this.emailService.sendTestEmail(to);
      return { ok: true, message: `Test email sent to ${to}. Check your inbox (and spam folder).` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Brevo email test failed: ${msg}`);
      return { ok: false, error: msg };
    }
  }
}
