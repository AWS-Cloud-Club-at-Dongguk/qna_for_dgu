import { Room } from "@/http/room/model";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamo } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";

export const saveRoomToDynamoDB = async (room: Room): Promise<void> => {
    const item = {
        roomId: { S: room.roomId },
        title: { S: room.title },
        createdAt: { S: room.createdAt },
        isActive: { BOOL: room.isActive },
    };

    // DynamoDB에 저장
    try {
        await dynamo.send(
            new PutItemCommand({
                TableName: TABLE_NAME_ROOM,
                Item: item,
            })
        );

    } catch (error: unknown) {

        // console.error("DynamoDB error:", error);

        const message = 
            error instanceof Error 
            ? error.message 
            : JSON.stringify(error);

            throw new DatabaseError("Failed [DynamoDB] in [createRoom] service : " + message);
    }
}