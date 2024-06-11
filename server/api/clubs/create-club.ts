import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    club: Club;
}


export default defineEventHandler(async (event) => {
    try {
        const { club } = await readBody<IRequestBody>(event);

        const clubCreate = await prisma.club.create({
            data: {
                name: club.name,
                address: club.address,
                country: club.country,
                city: club.city,
                phoneNumber: club.phoneNumber.toString(),
                linkToImage: club.linkToImage
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
