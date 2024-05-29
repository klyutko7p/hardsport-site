import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    plan: Plan;
}


export default defineEventHandler(async (event) => {
    try {
        const { plan } = await readBody<IRequestBody>(event);

        const planCreate = await prisma.plan.create({
            data: {
                name: plan.name,
                description: plan.description,
                benefits: plan.benefits,
                duration: plan.duration,
                price: plan.price,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
