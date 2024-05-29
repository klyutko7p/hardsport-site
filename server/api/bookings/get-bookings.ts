import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        schedule: {
          include: {
            trainer: true,
            workout: {
              include: {
                club: true,
              },
            },
          },
        },
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        {
          id: "asc",
        },
        {
          bookingDateTime: "asc",
        },
      ],
    });
    return bookings;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
