import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  booking: Booking;
}

export default defineEventHandler(async (event) => {
  try {
    const { booking } = await readBody<IRequestBody>(event);

    const bookingCreate = await prisma.booking.create({
      data: {
        userId: booking.userId,
        scheduleId: booking.scheduleId,
        bookingDateTime: new Date(booking.bookingDateTime),
        status: booking.status,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
