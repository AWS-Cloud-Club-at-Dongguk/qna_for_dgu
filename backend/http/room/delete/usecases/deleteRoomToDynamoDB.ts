import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamo } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";

export const deleteRoomToDynamoDB = async (roomId: string): Promise<void> => {
    const params = {
        TableName: TABLE_NAME_ROOM,
        Key: {
            roomId: { S: roomId },
        },
    };

    try {
        await dynamo.send(new DeleteItemCommand(params));
    } catch (error: unknown) {
        const message = 
            error instanceof Error 
            ? error.message 
            : JSON.stringify(error);

        throw new DatabaseError("Failed [DynamoDB] in [deleteRoomToDynamoDB] usecase : " + message);
    }
}