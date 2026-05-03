import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Inštalatérstvo', slug: 'instalaterstvo', icon: 'plumbing' },
  { name: 'Elektrikár', slug: 'elektrikar', icon: 'electrical_services' },
  { name: 'Maľovanie', slug: 'malovanie', icon: 'format_paint' },
  { name: 'Tesárstvo', slug: 'tesarstvo', icon: 'carpenter' },
  { name: 'Upratovanie', slug: 'upratovanie', icon: 'cleaning_services' },
  { name: 'Sťahovanie', slug: 'stahovanie', icon: 'local_shipping' },
  { name: 'Rekonštrukcia', slug: 'rekonstrukcia', icon: 'construction' },
  { name: 'Záhradníctvo', slug: 'zahradnictvo', icon: 'yard' },
  { name: 'Zámočníctvo', slug: 'zamocnictvo', icon: 'lock' },
  { name: 'Oprava spotrebičov', slug: 'oprava-spotrebicov', icon: 'home_repair_service' },
  { name: 'Starostlivosť o zvieratá', slug: 'starostlivost-o-zvierata', icon: 'pets' },
  { name: 'Opatrovateľstvo', slug: 'opatrovatelstvo', icon: 'elderly' },
  { name: 'IT a počítače', slug: 'it-a-pocitace', icon: 'computer' },
  { name: 'Doučovanie', slug: 'doucovanie', icon: 'school' },
];

async function main() {
  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon },
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
