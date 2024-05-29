import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    subscription: Subscription;
}


export default defineEventHandler(async (event) => {
    try {
        const { subscription } = await readBody<IRequestBody>(event);

        const updateSubscription = await prisma.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                customerId: subscription.customerId,
                expirationDate: subscription.expirationDate,
                planId: subscription.planId,
                purchaseDateTime: subscription.purchaseDateTime,
                status: subscription.status,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
