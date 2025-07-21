import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GetConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyResultV2, APIGatewayProxyWebsocketEventV2 } from "aws-lambda";

export const handler = async function (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> {
  let connectionInfo;
  let connectionId = event.requestContext.connectionId;

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;

  // local 환경이면 HTTP 사용
  const endpoint = domain.includes("localhost")
    ? `http://${domain}:3001`
    : `https://${domain}/${stage}`;

  const callbackAPI = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint,
  });

  try {
    connectionInfo = await callbackAPI.send(
      new GetConnectionCommand({
        ConnectionId: connectionId,
      })
    );
  } catch (e) {
    console.log(e);
  }

  await callbackAPI.send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data:
        "Use the sendmessage route to send a message. Your info:" +
        JSON.stringify(connectionInfo),
    })
  );
  return {
    statusCode: 200,
  };
};
