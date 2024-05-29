import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const categories = await prisma.lessonCategory.findMany({
            include: {
                lessons: true,
            }
        });
        return categories;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
