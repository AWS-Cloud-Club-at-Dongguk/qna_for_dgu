// lambda function to delete a room
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { deleteRoom } from "@/http/room/delete/service";
import { AppError } from "@/common/errors/AppError";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const roomId = event.queryStringParameters?.roomId;

    if (!roomId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Room ID is required"
            })
        };
    }

    try {
        await deleteRoom(roomId);

        return {
            statusCode: 204, // No Content
            body: ""
        };
    } catch (error) {
        if (error instanceof AppError) {
            // console.error("AppError:", error);
            
            return {
                statusCode: error.statusCode,
                body: JSON.stringify({
                    message: error.message
                })
            };
        }

        // console.error("Unexpected error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error"
            })
        };
    }
}