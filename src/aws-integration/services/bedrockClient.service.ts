import {BedrockClient} from "@aws-sdk/client-bedrock";
import {awsCredentials} from "./awsCredentials.service.ts";

const client = new BedrockClient({credentials: awsCredentials, region: "eu-central-1"});

export function getBedrockClient() {
  return client;
}
