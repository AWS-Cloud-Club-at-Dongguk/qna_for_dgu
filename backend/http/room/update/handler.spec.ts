import { handler } from "@/http/room/update/handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

describe("updateRoom Lambda handler", () => {
    it("should return 200 with updated room title on successful room update", async () => {
        const mockEvent: APIGatewayProxyEvent = {
            body: JSON.stringify({ roomId: "b408c472-58fb-4f80-9835-94ae0642deb5", title: "Updated Room Title" }),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;

        // console.log("Status Code:", response.statusCode);
        // console.log("Parsed Body:", JSON.parse(response.body));

        // parse를 해야 JSON이 올바르게 처리됨
        const parsedResponse = JSON.parse(response.body);
        expect(parsedResponse).toEqual({
            title: expect.any(String),
        });
    });
});