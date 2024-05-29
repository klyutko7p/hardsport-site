import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  booking: Lesson;
}

export default defineEventHandler(async (event) => {
  try {
    const { booking } = await readBody<IRequestBody>(event);

    const bookingCreate = await prisma.onlineBooking.create({
      data: {
        bookedDateTime: new Date(booking.bookedDateTime),
        customerId: booking.customerId,
        serviceId: booking.serviceId,
        clubId: booking.clubId,
        status: booking.status,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
