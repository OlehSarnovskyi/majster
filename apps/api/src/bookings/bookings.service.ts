import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async create(clientId: string, dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
      include: { master: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.masterId === clientId) {
      throw new BadRequestException('You cannot book your own service');
    }

    const startTime = new Date(dto.startTime);

    if (startTime <= new Date()) {
      throw new BadRequestException('Booking time must be in the future');
    }

    const endTime = new Date(
      startTime.getTime() + service.durationMinutes * 60000
    );

    // Check for overlapping bookings for this master
    const overlap = await this.prisma.booking.findFirst({
      where: {
        masterId: service.masterId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlap) {
      throw new BadRequestException(
        'This time slot is already booked. Please choose a different time.'
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        clientId,
        masterId: service.masterId,
        serviceId: dto.serviceId,
        startTime,
        endTime,
        note: dto.note,
      },
      include: {
        service: true,
        client: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        master: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    this.emailService.sendNewBookingNotification(booking).catch((err) =>
      this.logger.error('Failed to send new booking notification', err)
    );

    return booking;
  }

  async findClientBookings(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        service: { include: { category: true } },
        master: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findMasterBookings(masterId: string) {
    return this.prisma.booking.findMany({
      where: { masterId },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async updateStatus(
    bookingId: string,
    userId: string,
    status: BookingStatus
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: { select: { email: true, firstName: true } },
        master: { select: { email: true, firstName: true } },
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (status === BookingStatus.CANCELLED) {
      if (booking.clientId !== userId && booking.masterId !== userId) {
        throw new ForbiddenException();
      }
    } else {
      if (booking.masterId !== userId) {
        throw new ForbiddenException(
          'Only the master can confirm or complete bookings'
        );
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        service: true,
        client: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        master: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    this.emailService.sendBookingStatusUpdate(updated).catch((err) =>
      this.logger.error('Failed to send booking status update email', err)
    );

    return updated;
  }
}
