import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        bookings: true,
        trainer: true,
        workout: {
          include: {
            club: true,
          },
        },
      },
      orderBy: [{ id: "asc" }],
    });
    return schedules;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
