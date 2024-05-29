import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    trainer: Trainer;
}


export default defineEventHandler(async (event) => {
    try {
        const { trainer } = await readBody<IRequestBody>(event);

        const trainerCreate = await prisma.trainer.create({
            data: {
                name: trainer.name,
                age: trainer.age,
                gender: trainer.gender,
                photo: trainer.photo,
                experience: trainer.experience,
                clubId: trainer.clubId,
            },
        });
    
        for (const certificationId of trainer.certifications) {
            await prisma.trainerCertification.create({
                data: {
                    trainerId: trainerCreate.id,
                    certificationId: certificationId.id,
                },
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }
});
