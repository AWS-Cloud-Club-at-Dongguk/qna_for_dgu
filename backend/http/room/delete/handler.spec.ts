import { handler } from "@/http/room/delete/handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

describe("deleteRoom Lambda handler", () => {
    it("should return 204 on successful room deletion", async () => {
        const mockEvent: APIGatewayProxyEvent = {
            body: JSON.stringify({ roomId: "b408c472-58fb-4f80-9835-94ae0642deb5" }),
        } as unknown as APIGatewayProxyEvent;

        const response = await handler(mockEvent, {} as any, () => {}) as APIGatewayProxyResult;

        // console.log("Status Code:", response.statusCode);
        // console.log("Parsed Body:", JSON.parse(response.body));

        expect(response.statusCode).toBe(204);
        expect(response.body).toBe("");
    });
});