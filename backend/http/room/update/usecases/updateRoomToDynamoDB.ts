import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

import { dynamo } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";
import { NotFoundError } from "@/common/errors/NotFoundError";

export const updateRoomToDynamoDB = async (roomId: string, newTitle: string): Promise<string> => {
    const params = {
        TableName: TABLE_NAME_ROOM,
        Key: {
            roomId: { S: roomId },
        },
        UpdateExpression: "SET title = :newTitle",
        ExpressionAttributeValues: {
            ":newTitle": { S: newTitle },
        },
        ReturnValues: "UPDATED_NEW" as const,
    };

    try {
        const result = await dynamo.send(new UpdateItemCommand(params));
        
        const updatedTitle = result.Attributes?.title?.S;
        if (!updatedTitle) {
            throw new NotFoundError(`NotFound [${roomId}] in [updateRoomTitleToDynamoDB] usecase`);
        }

        return updatedTitle;
    } catch (error: unknown) {
        const message = 
            error instanceof Error 
            ? error.message 
            : JSON.stringify(error);

        throw new DatabaseError("Failed [DynamoDB] in [updateRoomTitleToDynamoDB] usecase : " + message);
    }
}