import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CATEGORIES = [
  { name: 'Inštalatérstvo',          slug: 'instalaterstvo',          icon: 'plumbing' },
  { name: 'Elektrikár',              slug: 'elektrikar',              icon: 'electrical_services' },
  { name: 'Maľovanie',               slug: 'malovanie',               icon: 'format_paint' },
  { name: 'Tesárstvo',               slug: 'tesarstvo',               icon: 'carpenter' },
  { name: 'Upratovanie',             slug: 'upratovanie',             icon: 'cleaning_services' },
  { name: 'Sťahovanie',              slug: 'stahovanie',              icon: 'local_shipping' },
  { name: 'Rekonštrukcia',           slug: 'rekonstrukcia',           icon: 'construction' },
  { name: 'Záhradníctvo',            slug: 'zahradnictvo',            icon: 'yard' },
  { name: 'Zámočníctvo',             slug: 'zamocnictvo',             icon: 'lock' },
  { name: 'Oprava spotrebičov',      slug: 'oprava-spotrebicov',      icon: 'home_repair_service' },
  { name: 'Starostlivosť o zvieratá',slug: 'starostlivost-o-zvierata',icon: 'pets' },
  { name: 'Opatrovateľstvo',         slug: 'opatrovatelstvo',         icon: 'elderly' },
  { name: 'IT a počítače',           slug: 'it-a-pocitace',           icon: 'computer' },
  { name: 'Doučovanie',              slug: 'doucovanie',              icon: 'school' },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  private async seedCategories() {
    try {
      for (const category of CATEGORIES) {
        await this.prisma.serviceCategory.upsert({
          where: { slug: category.slug },
          update: { name: category.name, icon: category.icon },
          create: category,
        });
      }
      this.logger.log(`Seeded ${CATEGORIES.length} categories`);
    } catch (err) {
      this.logger.error('Failed to seed categories', err);
    }
  }
}
