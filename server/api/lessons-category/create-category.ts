import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    category: LessonCategory;
}


export default defineEventHandler(async (event) => {
    try {
        const { category } = await readBody<IRequestBody>(event);

        const categoryCreate = await prisma.lessonCategory.create({
            data: {
                categoryName: category.categoryName,
                iconName: category.iconName,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
