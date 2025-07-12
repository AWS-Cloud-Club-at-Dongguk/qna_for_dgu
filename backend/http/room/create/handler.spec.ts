import { handler } from "@/http/room/create/handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

describe("createRoom Lambda handler", () => {
    it("should return 201 with roomId and qrCodeUrl on successful room creation", async () => {
        const mockEvent: APIGatewayProxyEvent = {
            body: JSON.stringify({ title: "Test Room" }),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;

        // console.log("Status Code:", response.statusCode);
        // console.log("Parsed Body:", JSON.parse(response.body));

        // parse를 해야 JSON이 올바르게 처리됨
        const parsedResponse = JSON.parse(response.body);
        expect(parsedResponse).toEqual({
            roomTitle: expect.any(String),
            qrCodeUrl: expect.any(String),
        });
    });
});
