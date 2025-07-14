import { Room } from "@/http/room/model";
import { DOMAIN } from "@/common/constants/domain";
import { generateQrCode } from "@/common/utils/generateQR";
import { generatePresignedGetUrl, generatePresignedUrl } from "@/common/utils/s3PresignedUrl";

export const createQRImg = async (room: Room): Promise<string> => {
    const joinUrl = `${DOMAIN}/room/${room.roomId}`;

    // 1. Generate QR code for the join URL
    const qrCode = await generateQrCode(joinUrl);

    // 2. Base64 → Buffer
    const base64Data = qrCode.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // 3. QR 코드를 presigned url로 S3에 업로드
    const presignedUrl = await generatePresignedUrl(`${room.roomId}.png`, "image/png");

    await fetch(presignedUrl, {
        method: "PUT",
        body: imageBuffer,
        headers: {
            "Content-Type": "image/png",
        },
    });

    // 5. 업로드된 S3 파일의 퍼블릭 접근을 위한 Presigned GET URL 생성 (유효 기간: 2일)
    const presignedGetUrl = await generatePresignedGetUrl(`${room.roomId}.png`);

    return presignedGetUrl;
}