import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Plumbing', slug: 'plumbing', icon: 'plumbing' },
  { name: 'Electrical', slug: 'electrical', icon: 'electrical_services' },
  { name: 'Painting', slug: 'painting', icon: 'format_paint' },
  { name: 'Carpentry', slug: 'carpentry', icon: 'carpenter' },
  { name: 'Cleaning', slug: 'cleaning', icon: 'cleaning_services' },
  { name: 'Moving', slug: 'moving', icon: 'local_shipping' },
  { name: 'Renovation', slug: 'renovation', icon: 'construction' },
  { name: 'Gardening', slug: 'gardening', icon: 'yard' },
  { name: 'Locksmith', slug: 'locksmith', icon: 'lock' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'home_repair_service' },
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
