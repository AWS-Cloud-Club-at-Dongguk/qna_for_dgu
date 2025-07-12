// lambda function to create a room
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createRoom } from "@/http/room/create/service";
import { AppError } from "@/common/errors/AppError";
import { generateQrCode } from "@/common/utils/createQR";
import { CreateRoomResponse, createRoomResponseSchema } from "../model";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Domain 설정
    const DOMAIN =
        process.env.NODE_ENV === "test"
            ? process.env.DOMAIN_DEV
            : process.env.DOMAIN_PROD;

    const body = JSON.parse(event.body || "{}");

    try {
        const response = await createRoom(body);
        const joinUrl = `${DOMAIN}/room/${response.roomId}`;

        // Generate QR code for the join URL
        const qrCode = await generateQrCode(joinUrl);
        
        // ToDo: QR 코드 Buffer로 이미지 변환 후 Discord Webhook에 전송

        const responseBody: CreateRoomResponse = createRoomResponseSchema.parse({
            roomTitle: response.title,
            qrCode: qrCode,
        })

        return {
            statusCode: 201,
            body: JSON.stringify(responseBody)
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