import { IsEnum } from 'class-validator';

export enum BookingAction {
  CONFIRM = 'CONFIRMED',
  CANCEL = 'CANCELLED',
  COMPLETE = 'COMPLETED',
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingAction)
  status: BookingAction;
}
