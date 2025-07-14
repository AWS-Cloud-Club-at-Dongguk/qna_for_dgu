import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  ...(process.env.NODE_ENV === "test" ? { endpoint: "http://localhost:8000" } : {}),
});