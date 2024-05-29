import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            include: {
                customer: true,
                plan: true,
            }
        });
        return subscriptions;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
