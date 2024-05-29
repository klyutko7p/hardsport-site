import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  booking: Booking;
}

export default defineEventHandler(async (event) => {
  try {
    const { booking } = await readBody<IRequestBody>(event);

    const updateBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        userId: booking.userId,
        scheduleId: booking.schedule.id,
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
