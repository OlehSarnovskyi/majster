export interface Booking {
  id: string;
  clientId: string;
  masterId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
