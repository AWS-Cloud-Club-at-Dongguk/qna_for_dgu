import { BadRequestError } from "@/common/errors/BadRequestError";
import { updateRoomToDynamoDB } from "@/http/room/update/usecases/updateRoomToDynamoDB";
import { UpdateRoomRequest, updateRoomRequestSchema, UpdateRoomResponse } from "@/http/room/model";

export const updateRoom = async (roomId: string, data: UpdateRoomRequest): Promise<UpdateRoomResponse> => {
    // 1. Validate the request data
    const parsedData = updateRoomRequestSchema.safeParse(data);
    if (!parsedData.success) {
        throw new BadRequestError("Bad Request in [updateRoom] service: " + JSON.stringify(parsedData.error.format()));
    }

    const { title } = parsedData.data;

    // 2. Update the room title in DynamoDB
    const updatedTitle = await updateRoomToDynamoDB(roomId, title);

    const responseBody: UpdateRoomResponse = {
        title: updatedTitle,
    }

    return responseBody;
}