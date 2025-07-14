// lambda function to create a room
import { CreateRoomRequest, CreateRoomResponse } from "@/http/room/model";

import { saveRoomToDynamoDB } from "@/http/room/create/usecases/saveRoomToDynamoDB";
import { buildRoom } from "@/http/room/create/usecases/buildRoom";
import { createQRImg } from "@/http/room/create/usecases/createQRImg";
import { sendDiscordNotification } from "@/http/room/create/usecases/sendDiscordNotification";

export const createRoom = async (data: CreateRoomRequest): Promise<CreateRoomResponse> => {
    // 1. Create a room object
    const room = await buildRoom(data);

    // 2. Save the room to DynamoDB
    await saveRoomToDynamoDB(room);

    // 3. Create a QR code image for the room
    const qrCodeUrl = await createQRImg(room);

    // 4. Send a notification to Discord with the room title and QR code URL
    await sendDiscordNotification(room.title, qrCodeUrl);

    // 5. Return the response
    const responseBody: CreateRoomResponse = {
        title: room.title,
        qrCodeUrl: qrCodeUrl,
    };

    return responseBody;
};