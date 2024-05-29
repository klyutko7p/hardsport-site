import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        category: true,
        trainer: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return lessons;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
