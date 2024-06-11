import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    id: number;
}

export default defineEventHandler(async (event) => {
    try {
        const { id } = await readBody<IRequestBody>(event);

        await prisma.trainerCertification.deleteMany({
            where: {
                trainerId: id,
            },
        });

        const deleteTrainer = await prisma.trainer.delete({
            where: {
                id: id,
            },
        });

        return { success: true, trainer: deleteTrainer };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }
});
