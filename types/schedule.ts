interface Schedule {
    id: number;
    workout: Workout;
    workoutId: number;
    dateTime: Date;
    maxParticipants: number;
    reservedSlots: number;
    trainer?: Trainer | null;
    trainerId?: number | null;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
  }
  