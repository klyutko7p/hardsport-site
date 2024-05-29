import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        onlineBooking: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return services;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
