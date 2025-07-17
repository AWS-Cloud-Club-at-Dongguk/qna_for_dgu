import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_CONNECTION } from "@/common/constants/table";

// 임시 type
type ConnectEvent = APIGatewayProxyWebsocketEventV2 & {
  queryStringParameters?: { [key: string]: string };
};

export const handler = async function (
  event: ConnectEvent
): Promise<APIGatewayProxyResultV2> {
  const connectionId = event.requestContext.connectionId;
  const roomId = event.queryStringParameters?.roomId;

  if (!roomId) {
    return {
      statusCode: 400,
      body: "Missing roomId in query parameters",
    };
  }

  const command = new PutCommand({
    TableName: TABLE_NAME_CONNECTION,
    Item: {
      connectionId,
      roomId,
    },
  });

  try {
    await docClient.send(command);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
    };
  }
  return {
    statusCode: 200,
  };
};
