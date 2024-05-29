import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    schedule: Schedule;
}


export default defineEventHandler(async (event) => {
    try {
        const { schedule } = await readBody<IRequestBody>(event);

        const scheduleCreate = await prisma.schedule.create({
            data: {
                dateTime: new Date(schedule.dateTime),
                maxParticipants: schedule.maxParticipants,
                reservedSlots: schedule.reservedSlots,
                trainerId: schedule.trainerId,
                workoutId: schedule.workoutId,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }
});
