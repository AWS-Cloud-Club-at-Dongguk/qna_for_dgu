import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE || 'slido-connections';

export const connectWebSocket = async (event, context) => {
  const { connectionId } = event.requestContext;
  const { roomId } = event.queryStringParameters || {};

  try {
    // 연결 정보를 DynamoDB에 저장
    await ddbDocClient.send(new PutCommand({
      TableName: CONNECTIONS_TABLE,
      Item: {
        connectionId,
        roomId: roomId || null,
        connectedAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24시간 TTL
      }
    }));

    console.log(`WebSocket connected: ${connectionId} to room: ${roomId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Connected successfully' })
    };
  } catch (error) {
    console.error('Error connecting WebSocket:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to connect' })
    };
  }
};

export const disconnectWebSocket = async (event, context) => {
  const { connectionId } = event.requestContext;

  try {
    // 연결 정보를 DynamoDB에서 삭제
    await ddbDocClient.send(new DeleteCommand({
      TableName: CONNECTIONS_TABLE,
      Key: { connectionId }
    }));

    console.log(`WebSocket disconnected: ${connectionId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Disconnected successfully' })
    };
  } catch (error) {
    console.error('Error disconnecting WebSocket:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to disconnect' })
    };
  }
};

export const handleMessage = async (event, context) => {
  const { connectionId, domainName, stage } = event.requestContext;
  
  try {
    const body = JSON.parse(event.body || '{}');
    const { action, data } = body;

    console.log(`WebSocket message from ${connectionId}:`, { action, data });

    // API Gateway Management API 클라이언트 생성
    const apiGatewayClient = new ApiGatewayManagementApiClient({
      endpoint: `https://${domainName}/${stage}`
    });

    switch (action) {
      case 'ping':
        // Ping-pong for connection health check
        await apiGatewayClient.send(new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() })
        }));
        break;

      case 'joinRoom':
        // 방 참여 로직 (필요시 구현)
        await apiGatewayClient.send(new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ 
            type: 'roomJoined', 
            roomId: data?.roomId,
            message: 'Successfully joined room'
          })
        }));
        break;

      default:
        console.log(`Unknown action: ${action}`);
        await apiGatewayClient.send(new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({ 
            type: 'error', 
            message: `Unknown action: ${action}` 
          })
        }));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message processed successfully' })
    };
  } catch (error) {
    console.error('Error handling WebSocket message:', error);
    
    // 연결이 끊어진 경우 정리
    if (error.name === 'GoneException') {
      await disconnectWebSocket(event, context);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process message' })
    };
  }
};