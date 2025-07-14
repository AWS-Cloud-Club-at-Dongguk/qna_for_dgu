import { DeleteRoomRequest, deleteRoomRequestSchema } from "@/http/room/model";
import { deleteRoomToDynamoDB } from "@/http/room/delete/usecases/deleteRoomToDynamoDB";
import { BadRequestError } from "@/common/errors/BadRequestError";

export const deleteRoom = async (data: DeleteRoomRequest): Promise<void> => {
    const parsedData = deleteRoomRequestSchema.safeParse(data);
    if (!parsedData.success) {
        throw new BadRequestError("Bad Request in [deleteRoom] service: " + JSON.stringify(parsedData.error.format()));
    }

    const { roomId } = parsedData.data;

    // 2. Delete the room from DynamoDB
    await deleteRoomToDynamoDB(roomId);
}