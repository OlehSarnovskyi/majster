import { Module } from '@nestjs/common';
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
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ServicesModule,
    BookingsModule,
    MastersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
