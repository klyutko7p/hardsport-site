import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface IRequestBody {
  phoneNumber: string;
  password: string;
}

function generateToken(user: User): string {
  const payload = {
    usernameTG: user.usernameTG,
    role: user.role,
  };

  const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

export default defineEventHandler(async (event) => {
  try {
    const { phoneNumber, password } = await readBody<IRequestBody>(event);

    const userData = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
      include: {
        profile: true,
      },
    });

    if (!userData) {
      return { error: "Пользователь не найден" };
    }

    const passwordMatch = await bcrypt.compare(password, userData.hashPassword);

    if (passwordMatch) {
      const token = generateToken(userData);
      return { data: { userData, token } };
    } else {
      return { error: "Неверный пароль" };
    }
  } catch (error: any) {
    console.error("Ошибка во время входа в систему:", error);
    return { error: "Ошибка во время входа в систему" };
  }
});
