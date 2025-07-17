import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";

import { docClient } from "@/common/constants/dynamo";
import {
  TABLE_NAME_CONNECTION,
  TABLE_NAME_MESSAGE,
} from "@/common/constants/table";

export const handler = async function (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> {
  const { message, roomId } = JSON.parse(event.body ?? "{}");

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  // local 환경이면 HTTP 사용
  const endpoint = domain.includes("localhost")
    ? `http://${domain}:3001`
    : `https://${domain}/${stage}`;

  if (message === undefined || !roomId) {
    return {
      statusCode: 400,
      body: "Missing roomId or message in request",
    };
  }

  // 메시지 저장
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME_MESSAGE,
      Item: {
        roomId,
        message: message,
        senderId: event.requestContext.connectionId,
        timestamp: new Date().toISOString(),
      },
    })
  );

  // Connections 에서 특정 roomId에 해당하는 모든 connectionId를 가져오기
  const ddbcommand = new ScanCommand({
    TableName: TABLE_NAME_CONNECTION,
    FilterExpression: "#roomId = :roomId",
    ExpressionAttributeNames: {
      "#roomId": "roomId",
    },
    ExpressionAttributeValues: {
      ":roomId": roomId,
    },
  });

  let connections;
  try {
    connections = await docClient.send(ddbcommand);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
    };
  }

  const callbackAPI = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint,
  });

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  }

  const items = connections.Items || [];

  const sendMessages = items.map(async ({ connectionId }) => {
    if (connectionId !== event.requestContext.connectionId) {
      try {
        await callbackAPI.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: message,
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  });

  try {
    await Promise.all(sendMessages); // 비동기 병령 처리
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
    };
  }

  return { statusCode: 200 };
};
