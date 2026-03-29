import { Controller, Get, Param } from '@nestjs/common';
import { MastersService } from './masters.service';

@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get()
  findAll() {
    return this.mastersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mastersService.findOne(id);
  }
}
