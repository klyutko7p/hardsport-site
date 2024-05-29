import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    certification: Certification;
}


export default defineEventHandler(async (event) => {
    try {
        const { certification } = await readBody<IRequestBody>(event);

        const certificationCreate = await prisma.certification.create({
            data: {
                name: certification.name,
                description: certification.description,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
