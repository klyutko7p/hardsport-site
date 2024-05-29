import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const certifications = await prisma.certification.findMany();
        return certifications;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
