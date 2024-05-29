import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                subscriptions: true,
            }
        });
        return plans;
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
