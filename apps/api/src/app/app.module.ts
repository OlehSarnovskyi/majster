import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { ServicesModule } from '../services/services.module';
import { BookingsModule } from '../bookings/bookings.module';
import { MastersModule } from '../masters/masters.module';
import { OriginMiddleware } from '../common/middleware/origin.middleware';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 5 },    // 5 req/sec
      { name: 'long', ttl: 60000, limit: 60 },    // 60 req/min
      { name: 'auth', ttl: 900000, limit: 10 },   // 10 req/15min (for auth endpoints; login uses stricter @Throttle)
    ]),
    PrismaModule,
    AuthModule,
    EmailModule,
    CategoriesModule,
    ServicesModule,
    BookingsModule,
    MastersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OriginMiddleware)
      .exclude(
        { path: 'api/auth/google/callback', method: RequestMethod.GET }, // Google redirects back
      )
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
