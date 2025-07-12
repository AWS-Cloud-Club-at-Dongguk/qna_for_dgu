// lambda function to create a room
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { Room, CreateRoomRequest, roomSchema } from "@/http/room/model";
import { DatabaseError } from "@/common/errors/DatabaseError";
import { BadRequestError } from "@/common/errors/BadRequestError";

const TABLE_NAME = process.env.TABLE_NAME_ROOM;
const dynamo = new DynamoDBClient({ 
    region: process.env.AWS_REGION,
    ...(process.env.NODE_ENV === "test" ? { endpoint: "http://localhost:8000" } : {})
});

// console.log("DynamoDB Client initialized with table name:", TABLE_NAME, "and region:", process.env.AWS_REGION, "env : ", process.env.NODE_ENV);

export const createRoom = async (data: CreateRoomRequest): Promise<any> => {
    const now = new Date().toISOString(); // ISO 8601 format
    const uuid = uuidv4();

    const room: Room = {
        roomId: uuid,
        title: data.title,
        createdAt: now,
        isActive: true,
    }

    // Zod validate - safeParse를 사용하여 객체 반환
    const parseResult = roomSchema.safeParse(room);

    if (!parseResult.success) {
        throw new BadRequestError("Bad Request in [createRoom] service : " + JSON.stringify(parseResult.error.format()));
    }

    const validRoom = parseResult.data;

    const item = {
        roomId: { S: validRoom.roomId },
        title: { S: validRoom.title },
        createdAt: { S: validRoom.createdAt },
        isActive: { BOOL: validRoom.isActive },
    };

    // DynamoDB에 저장
    try {
        await dynamo.send(
            new PutItemCommand({
                TableName: TABLE_NAME,
                Item: item,
            })
        );

    } catch (error: unknown) {

        // console.error("DynamoDB error:", error);

        const message = 
            error instanceof Error 
            ? error.message 
            : JSON.stringify(error);

            throw new DatabaseError("Failed [DynamoDB] in [createRoom] service : " + message);
    }

    return validRoom;
};