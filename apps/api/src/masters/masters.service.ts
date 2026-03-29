import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MastersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: Role.MASTER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        _count: { select: { services: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const master = await this.prisma.user.findUnique({
      where: { id, role: Role.MASTER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        phone: true,
        services: {
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!master) {
      throw new NotFoundException('Master not found');
    }

    return master;
  }
}
