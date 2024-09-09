import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { resourceSettings } from "./awsCredentials.service.ts";
import { getDynamoDbClient } from "./dynamoDbClient.service.ts";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ChatConversationElement } from "../../app/model/chatConversationElement.ts";
import { ChatConversation } from "../../app/model/chatConversation.ts";
import { ChatConversationMessage } from "../../app/model/ChatConversationMessage.ts";
import { ChatConversationWithAdditionalState } from "../model/chatConversationWithAdditionalState.ts";
import { getChatConversationTableKey } from "./getChatConversationTableKey.service.ts";

export async function queryChatConversation(
  modelId: string,
  chatId: string,
): Promise<ChatConversation | null> {
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
  });
  const items = (await getDynamoDbClient().send(command)).Items;
  if (!items || items.length === 0) {
    return null;
  }
  const elements = items.map((o) => unmarshall(o)) as ChatConversationElement[];
  const conversation = elements.find(
    (el) => el.dtype === "conversation",
  ) as ChatConversationWithAdditionalState | null;
  if (!conversation) {
    throw new Error("No conversation element found for key " + tableKey);
  }
  conversation.messages = elements.filter(
    (el) => el.dtype === "message",
  ) as ChatConversationMessage[];
  conversation.originalConversation = {...conversation};
  conversation["table-key"] = tableKey;
  if (conversation.modelId !== modelId) {
    throw new Error("Mismatching model id!");
  }
  if (conversation.id !== chatId) {
    throw new Error("Mismatching chat id in payload!");
  }

  return conversation;
}
