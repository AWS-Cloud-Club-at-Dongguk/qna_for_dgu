// lambda function to get messages in a room
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getMessages } from "@/http/room/message/get/service";
import { AppError } from "@/common/errors/AppError";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const roomId = event.pathParameters?.id;

    if (!roomId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Room ID is required"
            })
        };
    }

    try {
        const response = await getMessages(roomId);

        return {
            statusCode: 200,
            body: JSON.stringify(response)
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
};