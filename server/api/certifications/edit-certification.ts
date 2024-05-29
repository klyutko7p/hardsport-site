import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    certification: Certification;
}


export default defineEventHandler(async (event) => {
    try {
        const { certification } = await readBody<IRequestBody>(event);

        const updateCertification = await prisma.certification.update({
            where: {
                id: certification.id,
            },
            data: {
                name: certification.name,
                description: certification.description,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
