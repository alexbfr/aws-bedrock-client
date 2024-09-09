import {BedrockClient} from "@aws-sdk/client-bedrock";
import {awsCredentials, resourceSettings} from "./awsCredentials.service.ts";

const client = new BedrockClient({credentials: awsCredentials, region: resourceSettings.region});

export function getBedrockClient() {
  return client;
}
