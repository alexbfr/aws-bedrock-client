import { resourceSettings } from "./awsCredentials.service.ts";
import { getDynamoDbClient } from "./dynamoDbClient.service.ts";
import { getChatConversationTableKey } from "./getChatConversationTableKey.service.ts";
import { DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function deleteChatConversation(modelId: string, chatId: string) {
  const tableKey = getChatConversationTableKey(modelId, chatId);
  const command = new QueryCommand({
    TableName: resourceSettings.dynamoDbTableName,
    KeyConditionExpression: "#tableKey = :tableKey",
    ExpressionAttributeNames: {
      "#tableKey": "table-key",
    },
    ExpressionAttributeValues: {
      ":tableKey": {
        S: tableKey,
      },
    },
    Select: "SPECIFIC_ATTRIBUTES",
    ProjectionExpression: "#tableKey,created",
  });

  const result = (await getDynamoDbClient().send(command)).Items!.map((obj) =>
    unmarshall(obj),
  ) as {
    "table-key": string;
    created: number;
  }[];
  const deleteItemsCommands = result.map(
    (item) =>
      new DeleteItemCommand({
        TableName: resourceSettings.dynamoDbTableName,
        Key: {
          "table-key": {
            S: item["table-key"],
          },
          created: {
            N: item.created.toString(),
          },
        },
        ReturnValues: "NONE",
      }),
  );

  const deletePromises = deleteItemsCommands.map((cmd) =>
    getDynamoDbClient().send(cmd),
  );

  await Promise.all(deletePromises);
}
