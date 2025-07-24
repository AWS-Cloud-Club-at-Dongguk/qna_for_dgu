import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  APIGatewayProxyResultV2,
  APIGatewayProxyWebsocketEventV2,
} from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';

import { docClient } from "@/common/constants/dynamo";
import {
  TABLE_NAME_CONNECTION,
  TABLE_NAME_MESSAGE,
} from "@/common/constants/table";

export const handler = async function (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> {
  const { nickname, message, roomId } = JSON.parse(event.body ?? "{}");

  const messageId = uuidv4();
  const timestamp = new Date().toISOString();

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  // local 환경이면 HTTP 사용
  const endpoint = domain.includes("localhost")
    ? `http://${domain}:5173`
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
        messageId,
        nickname,
        content: message,
        senderId: event.requestContext.connectionId,
        timestamp,
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
      body: JSON.stringify({ message: "Failed to fetch connections" }),
    };
  }

  if (!connections.Items || connections.Items.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "No connections found for this room" }),
    };
  }

  const callbackAPI = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint,
  });

  const items = connections.Items;
  const currentConnectionId = event.requestContext.connectionId;

  const sendMessages = items
    .filter(({ connectionId, roomId: connRoomId }) => 
      // 같은 방에 있는 다른 연결만 필터링
      connectionId !== currentConnectionId && connRoomId === roomId
    )
    .map(async ({ connectionId }) => {
      try {
        await callbackAPI.send(
          new PostToConnectionCommand({
            ConnectionId: connectionId,
            Data: JSON.stringify({
              type: 'message',
              messageId,
              nickname,
              message,
              roomId,
              timestamp
            }),
          })
        );
      } catch (e) {
        console.log(`Failed to send message to connection ${connectionId}:`, e);
        // 연결이 끊어진 경우 해당 connection 제거
        if ((e as any).statusCode === 410) {
          try {
            await docClient.send(
              new DeleteCommand({
                TableName: TABLE_NAME_CONNECTION,
                Key: {
                  connectionId
                }
              })
            );
          } catch (deleteErr) {
            console.log(`Failed to delete stale connection ${connectionId}:`, deleteErr);
          }
        }
      }
    });

  try {
    await Promise.all(sendMessages);
  } catch (e) {
    console.log('Failed to send messages:', e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send messages" }),
    };
  }

  return { statusCode: 200 };
};