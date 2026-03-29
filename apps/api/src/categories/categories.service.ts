import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { services: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.serviceCategory.findUnique({
      where: { slug },
      include: {
        services: {
          include: {
            master: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
      },
    });
  }
}
