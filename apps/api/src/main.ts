import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // CSP disabled — Angular SPA requires 'unsafe-inline' for event handlers and
  // external font sources (Material Icons CDN), which defeats XSS protection.
  // Proper fix requires Angular nonce support (ngCspNonce) — future task.
  app.use(helmet({ contentSecurityPolicy: false }));

  // Cookie parser (needed for OAuth state verification)
  app.use(cookieParser());

  // CORS (dev only — in production, API and frontend are on the same origin)
  if (process.env.NODE_ENV !== 'production') {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    app.enableCors({ origin: frontendUrl, credentials: true });
  }

  // Serve uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Production: serve Angular build from same origin (no CORS needed)
  if (process.env.NODE_ENV === 'production') {
    const webBuildPath = join(process.cwd(), 'dist', 'apps', 'web', 'browser');
    app.useStaticAssets(webBuildPath);

    // SPA catch-all: serve index.html for client-side routes (non-API requests)
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(
      (
        req: { path: string },
        res: { sendFile: (p: string) => void },
        next: () => void
      ) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(join(webBuildPath, 'index.html'));
      }
    );
  }

  const port = process.env.PORT || process.env.API_PORT || 3000;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
