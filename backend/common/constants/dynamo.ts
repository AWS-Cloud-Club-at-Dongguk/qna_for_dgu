import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  ...(process.env.DYNAMO_ENDPOINT ? { endpoint: process.env.DYNAMO_ENDPOINT } : {}),
});

export const docClient = DynamoDBDocumentClient.from(dynamo);