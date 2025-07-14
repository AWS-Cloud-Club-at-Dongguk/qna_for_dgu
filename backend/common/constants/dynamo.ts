import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  ...(process.env.NODE_ENV === "test" ? { endpoint: "http://localhost:8000" } : {}),
});

export const docClient = DynamoDBDocumentClient.from(dynamo);