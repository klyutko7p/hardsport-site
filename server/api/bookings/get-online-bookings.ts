import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const bookings = await prisma.onlineBooking.findMany({
      include: {
        customer: true,
        service: true,
        club: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return bookings;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});