import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    category: LessonCategory;
}


export default defineEventHandler(async (event) => {
    try {
        const { category } = await readBody<IRequestBody>(event);

        const updateCategory = await prisma.lessonCategory.update({
            where: {
                id: category.id,
            },
            data: {
                categoryName: category.categoryName,
                iconName: category.iconName,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});

