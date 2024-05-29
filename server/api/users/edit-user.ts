import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  user: User;
}

export default defineEventHandler(async (event) => {
  try {
    const { user } = await readBody<IRequestBody>(event);

    const updateProfile = await prisma.profile.update({
      where: {
        userId: user.id,
      },
      data: {
        name: user.profile.name,
        surname: user.profile.surname,
        gender: user.profile.gender === 'Мужской' ? 'FEMALE' : 'MALE',
        age: user.profile.age,
        height: user.profile.height,
        weight: user.profile.weight,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
