import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  service: Service;
}

export default defineEventHandler(async (event) => {
  try {
    const { service } = await readBody<IRequestBody>(event);

    const updateService = await prisma.service.update({
      where: {
        id: service.id,
      },
      data: {
        name: service.name,
        description: service.description,
        type: service.type,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});