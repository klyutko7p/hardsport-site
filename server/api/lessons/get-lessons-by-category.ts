import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  id: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody<IRequestBody>(event);

    const lessons = await prisma.lesson.findMany({
      where: {
        categoryId: id,
      },
      include: {
        category: true,
        trainer: true,
      }
    });
    return lessons;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
