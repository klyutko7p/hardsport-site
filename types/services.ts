interface Service {
  id: number;
  name: string;
  description?: string | null;
  type: string;
  onlineBooking: OnlineBooking[];
}

