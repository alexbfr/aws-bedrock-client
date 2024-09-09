import {awsCredentials} from "./awsCredentials.service.ts";
import {BedrockRuntimeClient} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({credentials: awsCredentials, region: "eu-central-1"});

export function getBedrockRuntimeClient() {
  return client;
}
