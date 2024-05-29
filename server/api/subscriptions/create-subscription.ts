import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  subscription: any;
}

export default defineEventHandler(async (event) => {
  try {
    const { subscription } = await readBody<IRequestBody>(event);

    const subscriptionCreate = await prisma.subscription.create({
      data: {
        customerId: subscription.customerId,
        expirationDate: new Date(subscription.expirationDate),
        planId: subscription.planId,
        purchaseDateTime: new Date(subscription.purchaseDateTime),
        status: subscription.status,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
