import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  workout: Workout;
}

export default defineEventHandler(async (event) => {
  try {
    const { workout } = await readBody<IRequestBody>(event);

    const categoryWorkout = await prisma.workout.create({
      data: {
        categoryId: workout.categoryId,
        clubId: workout.clubId,
        description: workout.description,
        title: workout.title,
        type: workout.type,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
