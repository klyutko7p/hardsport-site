import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  id: number;
}

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody<IRequestBody>(event);

    const userData = await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        bookings: {
          include: {
            schedule: {
              include: {
                bookings: true,
                trainer: true,
                workout: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        onlineBooking: {
          include: { club: true, service: true },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
