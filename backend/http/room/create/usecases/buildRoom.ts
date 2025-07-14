import { v4 as uuidv4 } from 'uuid';
import { CreateRoomRequest, Room, roomSchema } from "@/http/room/model";
import { BadRequestError } from '@/common/errors/BadRequestError';

export const buildRoom = async (data: CreateRoomRequest): Promise<Room> => {
    const now = new Date().toISOString(); // ISO 8601 format
    const uuid = uuidv4();

    const room: Room = {
        roomId: uuid,
        title: data.title,
        createdAt: now,
        isActive: true,
    }

    // Zod validate - safeParse를 사용하여 객체 반환
    const parseResult = roomSchema.safeParse(room);

    if (!parseResult.success) {
        throw new BadRequestError("Bad Request in [createRoom] service : " + JSON.stringify(parseResult.error.format()));
    }

    const validRoom = parseResult.data;

    return validRoom;
}