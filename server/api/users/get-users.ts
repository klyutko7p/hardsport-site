import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true, 
        bookings: true,
        subscription: true,
        onlineBooking: true,
      },
      orderBy: [{ id: "asc" }],
    });
    return users;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
