import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        category: true,
        club: true,
        schedules: {
          include: {
            trainer: true,
          }
        },
      },
    });
    return workouts;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
