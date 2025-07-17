import { Message } from "@/http/room/model";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_MESSAGE } from "@/common/constants/table";
import { DatabaseError } from "@/common/errors/DatabaseError";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const fetchMessagesFromDynamoDB = async (
  roomId: string
): Promise<Message[]> => {
  const params = {
    TableName: TABLE_NAME_MESSAGE,
    KeyConditionExpression: "roomId = :roomId",
    ExpressionAttributeValues: {
      ":roomId": roomId,
    },
    ScanIndexForward: true, // true = ASC, false = DESC
  };

  try {
    const response = await docClient.send(new QueryCommand(params));

    return response.Items as Message[] || [];

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new DatabaseError(
      "Failed [DynamoDB] in [fetchMessagesFromDynamoDB] use case: " + message
    );
  }
};
