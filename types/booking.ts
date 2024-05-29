interface Booking {
  id: number;
  schedule: Schedule;
  scheduleId: number;
  user: User;
  userId: number;
  status: string;
  bookingDateTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
