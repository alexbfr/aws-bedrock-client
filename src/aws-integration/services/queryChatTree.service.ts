import { ChatTreeBranch } from "../../app/model/chatTreeBranch.ts";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { resourceSettings } from "./awsCredentials.service.ts";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getDynamoDbClient } from "./dynamoDbClient.service.ts";

export async function queryChatTree(modelId: string): Promise<ChatTreeBranch | null> {
  const tableKey = `conversations-v1: ${modelId}`;
  const command = new GetItemCommand({
    TableName: resourceSettings.dynamoDbTableName,
    Key: { "table-key": { S: tableKey }, "created": { N: "0"} },
  });
  const item = (await getDynamoDbClient().send(command)).Item;
  if (!item) {
    return null;
  }
  return unmarshall(item) as ChatTreeBranch;
}
