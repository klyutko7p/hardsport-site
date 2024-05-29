import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const clubs = await prisma.club.findMany();
        return clubs;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
