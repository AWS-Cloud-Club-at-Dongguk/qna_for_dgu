import {handler} from "@/http/room/message/get/handler";
import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

describe("getMessages Lambda handler", () => {
    it("should return 200 with messages for a valid room ID", async () => {
        const mockEvent: APIGatewayProxyEvent = {
            pathParameters: { roomId: "b408c472-58fb-4f80-9835-94ae0642deb5" },
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;

        // console.log("Status Code:", response.statusCode);
        // console.log("Parsed Body:", JSON.parse(response.body));

        const parsedResponse = JSON.parse(response.body);
        expect(parsedResponse).toEqual({
            messages: expect.arrayContaining([
                expect.objectContaining({
                    messageId: expect.any(String),
                    content: expect.any(String),
                    createdAt: expect.any(String),
                    senderId: expect.any(String),
                }),
            ]),
            });
        });
    });
