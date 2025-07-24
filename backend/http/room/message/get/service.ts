// lambda function to get messages in a room
import { GetRoomMessagesResponse } from "@/http/room/model";

import { fetchMessagesFromDynamoDB } from "@/http/room/message/get/usecases/fetchMessagesFromDynamoDB";

export const getMessages = async (roomId: string): Promise<GetRoomMessagesResponse> => {

    // 1. Fetch messages from DynamoDB
    const messages = await fetchMessagesFromDynamoDB(roomId);

    // 2. Return the response
    const responseBody: GetRoomMessagesResponse = {
        messages: messages.map(message => ({
            messageId: message.messageId,
            nickname: message.nickname,
            content: message.content,
            timestamp: message.timestamp,
            senderId: message.senderId,
        })),
    };

    return responseBody;
};