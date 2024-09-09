import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsCredentials } from "./awsCredentials.service.ts";

const client = new DynamoDBClient({
  credentials: awsCredentials,
  region: "eu-central-1",
  maxAttempts: 5,
});

export function getDynamoDbClient() {
  return client;
}
