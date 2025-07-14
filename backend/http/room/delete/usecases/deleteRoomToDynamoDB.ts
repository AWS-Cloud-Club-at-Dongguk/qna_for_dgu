import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";

export const deleteRoomToDynamoDB = async (roomId: string): Promise<void> => {
    const params = {
        TableName: TABLE_NAME_ROOM,
        Key: {
            roomId,
        },
    };

    try {
        await docClient.send(new DeleteCommand(params));
    } catch (error: unknown) {
        const message = 
            error instanceof Error 
            ? error.message 
            : JSON.stringify(error);

        throw new DatabaseError("Failed [DynamoDB] in [deleteRoomToDynamoDB] usecase : " + message);
    }
}