interface OnlineBooking {
  id: number;
  service: Service;
  serviceId: number;
  bookedDateTime: Date;
  customer: User;
  customerId: number;
  club: Club;
  clubId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
