import { AwsCredentialIdentity } from "@smithy/types/dist-types/identity/awsCredentialIdentity";

export const awsCredentials: AwsCredentialIdentity = {
  accessKeyId: import.meta.env.VITE_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_SECRET_KEY,
};

export const resourceSettings = {
  dynamoDbTableName: import.meta.env.VITE_DYNAMO_DB_TABLE_NAME,
  summarizeModelId:
    import.meta.env.VITE_SUMMARIZE_MODEL_ID ||
    "anthropic.claude-3-haiku-20240307-v1:0",
};
