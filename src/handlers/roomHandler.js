import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const ROOMS_TABLE = process.env.ROOMS_TABLE || 'slido-rooms';

export const createRoom = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { title, description, duration = 3600 } = body; // 기본 1시간

    if (!title) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Room title is required' })
      };
    }

    const roomId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration * 1000);

    const room = {
      roomId,
      title,
      description: description || '',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: true,
      questionCount: 0
    };

    await ddbDocClient.send(new PutCommand({
      TableName: ROOMS_TABLE,
      Item: room
    }));

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Room created successfully',
        room: {
          roomId: room.roomId,
          title: room.title,
          description: room.description,
          createdAt: room.createdAt,
          expiresAt: room.expiresAt
        }
      })
    };
  } catch (error) {
    console.error('Error creating room:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Failed to create room',
        error: error.message 
      })
    };
  }
};