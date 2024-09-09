import { ChatTreeBranch } from "../../app/model/chatTreeBranch.ts";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { resourceSettings } from "./awsCredentials.service.ts";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getDynamoDbClient } from "./dynamoDbClient.service.ts";
import { tableKeys } from "./tableKeys.service.ts";

export async function saveChatTree(
  modelId: string,
  branch: ChatTreeBranch,
): Promise<void> {
  const tableKey = tableKeys.getChatTreeKey(modelId);
  const command = new PutItemCommand({
    TableName: resourceSettings.dynamoDbTableName,
    Item: marshall({
      ...branch,
      "table-key": tableKey,
    }),
  });
  try {
    await getDynamoDbClient().send(command);
  } catch (e: unknown) {
    console.error(e);
    throw new Error("Couldn't save to dynamodb, key: " + tableKey);
  }
}
