import { DeleteRoomRequest, deleteRoomRequestSchema } from "@/http/room/model";
import { deleteRoomToDynamoDB } from "@/http/room/delete/usecases/deleteRoomToDynamoDB";
import { BadRequestError } from "@/common/errors/BadRequestError";

export const deleteRoom = async (roomId: string): Promise<void> => {
    // 1. Delete the room from DynamoDB
    await deleteRoomToDynamoDB(roomId);
}