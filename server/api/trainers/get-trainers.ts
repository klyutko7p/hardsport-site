import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        club: true,
        TrainerCertification: {
          include: {
            certification: true,
          },
        },
        lessons: true,
        schedules: {
          include: {
            bookings: true,
            workout: true,
          }
        },
      },
      orderBy: [{ id: "asc" }],
    });
    return trainers;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
