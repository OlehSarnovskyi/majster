import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 5 },   // 5 req/sec
      { name: 'long', ttl: 60000, limit: 60 },   // 60 req/min
    ]),
    PrismaModule,
    AuthModule,
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
export class AppModule {}
