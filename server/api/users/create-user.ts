import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 10;

interface IRequestBody {
  user: User;
}

export default defineEventHandler(async (event) => {
  try {
    const { user } = await readBody<IRequestBody>(event);
    const hashPassword = await bcrypt.hash(user.password, saltRounds);

    const userData = await prisma.user.create({
      data: {
        usernameTG: user.usernameTG,
        phoneNumber: user.phoneNumber,
        hashPassword: hashPassword,
        role: "USER",
        profile: {
          create: {
            name: user.profile.name,
            surname: user.profile.surname,
            gender: 'MALE',
            age: user.profile.age,
            height: user.profile.height,
            weight: user.profile.weight,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
});
