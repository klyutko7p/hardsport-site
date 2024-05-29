import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  lesson: Lesson;
}

export default defineEventHandler(async (event) => {
  try {
    const { lesson } = await readBody<IRequestBody>(event);

    const lessonCreate = await prisma.lesson.create({
      data: {
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        videoLink: lesson.videoLink,
        trainerId: lesson.trainerId,
        categoryId: lesson.categoryId,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
