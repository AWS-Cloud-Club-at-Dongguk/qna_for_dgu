import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_ROOM } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { UpdateRoomRequest } from "@/http/room/model";

export const updateRoomToDynamoDB = async (roomId: string, data: UpdateRoomRequest): Promise<string> => {
    const updateFields: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    if (data.title !== undefined) {
        updateFields.push('title = :newTitle');
        expressionAttributeValues[':newTitle'] = data.title;
    }
    if (data.description !== undefined) {
        updateFields.push('description = :newDescription');
        expressionAttributeValues[':newDescription'] = data.description;
    }
    if (data.iconUrl !== undefined) {
        updateFields.push('iconUrl = :newIconUrl');
        expressionAttributeValues[':newIconUrl'] = data.iconUrl;
    }
    if (data.bannerUrl !== undefined) {
        updateFields.push('bannerUrl = :newBannerUrl');
        expressionAttributeValues[':newBannerUrl'] = data.bannerUrl;
    }

    const params = {
        TableName: TABLE_NAME_ROOM,
        Key: {
            roomId
        },
        UpdateExpression: `SET ${updateFields.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW" as const,
    };

    try {
        const result = await docClient.send(new UpdateCommand(params));

        const updatedTitle = result.Attributes?.title;
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