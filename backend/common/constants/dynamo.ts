import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  endpoint: process.env.DYNAMO_ENDPOINT!,
});

export const docClient = DynamoDBDocumentClient.from(dynamo);