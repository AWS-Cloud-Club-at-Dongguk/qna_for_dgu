import { Room } from "@/http/room/model";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";

export const saveRoomToDynamoDB = async (room: Room): Promise<void> => {

    const { roomId, title, createdAt, isActive } = room;
    
    const item = {
        roomId,
        title,
        createdAt,
        isActive,
    };

    // DynamoDB에 저장
    try {
        await docClient.send(
            new  PutCommand({
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