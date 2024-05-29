import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    category: WorkoutCategory;
}


export default defineEventHandler(async (event) => {
    try {
        const { category } = await readBody<IRequestBody>(event);

        const updateCategory = await prisma.workoutCategory.update({
            where: {
                id: category.id,
            },
            data: {
                name: category.name,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});

