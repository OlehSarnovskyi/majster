import { Module } from '@nestjs/common';
import { MastersService } from './masters.service';
import { MastersController } from './masters.controller';

@Module({
  controllers: [MastersController],
  providers: [MastersService],
})
export class MastersModule {}
