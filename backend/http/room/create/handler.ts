// lambda function to create a room
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createRoom } from "@/http/room/create/service";
import { AppError } from "@/common/errors/AppError";
import { generateQrCode } from "@/common/utils/generateQR";
import { CreateRoomResponse, createRoomResponseSchema } from "../model";
import { generatePresignedGetUrl, generatePresignedUrl } from "@/common/utils/s3PresignedUrl";
import { sendDiscordMsg } from "@/common/utils/sendDiscordMsg";

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

        // 1. Generate QR code for the join URL
        const qrCode = await generateQrCode(joinUrl);

        // 2. Base64 → Buffer
        const base64Data = qrCode.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");

        // 3. QR 코드를 presigned url로 S3에 업로드
        const presignedUrl = await generatePresignedUrl(`${response.roomId}.png`, "image/png");

        await fetch(presignedUrl, {
            method: "PUT",
            body: imageBuffer,
            headers: {
                "Content-Type": "image/png",
            },
        });

        // 5. 업로드된 S3 파일의 퍼블릭 접근을 위한 Presigned GET URL 생성 (유효 기간: 2일)
        const presignedGetUrl = await generatePresignedGetUrl(`${response.roomId}.png`);

        // 6. discord webhook에 전송
        sendDiscordMsg(response.title, presignedGetUrl);

        // 7. 응답 객체 생성
        const responseBody: CreateRoomResponse = createRoomResponseSchema.parse({
            roomTitle: response.title,
            qrCodeUrl: presignedGetUrl,
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