import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";

import { docClient } from "@/common/constants/dynamo";
import { TABLE_NAME_CONNECTION } from "@/common/constants/table";

export const handler = async function (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> {
  const command = new DeleteCommand({
    TableName: TABLE_NAME_CONNECTION,
    Key: {
      connectionId: event.requestContext.connectionId,
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
