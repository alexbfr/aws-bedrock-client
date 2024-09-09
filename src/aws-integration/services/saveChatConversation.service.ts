import { ChatConversation } from "../../app/model/chatConversation.ts";
import { ChatConversationWithAdditionalState } from "../model/chatConversationWithAdditionalState.ts";
import { DeleteItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { resourceSettings } from "./awsCredentials.service.ts";
import { marshall } from "@aws-sdk/util-dynamodb";
import { getDynamoDbClient } from "./dynamoDbClient.service.ts";
import { PersistedChatConversation } from "../model/persistedChatConversation.ts";
import { getChatConversationTableKey } from "./getChatConversationTableKey.service.ts";

export async function saveChatConversation(
  conversationProvided: ChatConversation,
) {
  const conversation =
    conversationProvided as ChatConversationWithAdditionalState;
  if (!conversation.originalConversation) {
    return saveNew(conversationProvided);
  }
  if (!conversation["table-key"]) {
    throw new Error("Missing tableKey!");
  }

  const tableKey = conversation["table-key"];
  const existingIds = conversation.originalConversation.messages.map(
    (c) => c.id,
  );
  const existingIdSet = new Set(existingIds);
  const currentIdMap = new Map(conversation.messages.map((c) => [c.id, c]));

  const messageIdsToUpdate = new Set(
    conversation.originalConversation.messages
      .filter(
        (existingMessage) =>
          currentIdMap.has(existingMessage.id) &&
          existingMessage.edited !==
            currentIdMap.get(existingMessage.id)!.edited,
      )
      .map((existingMessage) => existingMessage.id),
  );

  const updatePromises = conversation.messages.map((currentMessage) => {
    if (
      messageIdsToUpdate.has(currentMessage.id) ||
      !existingIdSet.has(currentMessage.id)
    ) {
      const command = new PutItemCommand({
        TableName: resourceSettings.dynamoDbTableName,
        Item: marshall({ ...currentMessage, "table-key": tableKey }),
      });
      return getDynamoDbClient().send(command);
    }
  });

  const deletePromises = conversation.originalConversation.messages
    .filter((existingMessage) => !currentIdMap.has(existingMessage.id))
    .map((existingMessage) => {
      const command = new DeleteItemCommand({
        TableName: resourceSettings.dynamoDbTableName,
        Key: {
          "table-key": {
            S: tableKey,
          },
          created: {
            N: existingMessage.created.toString(),
          },
        },
      });
      return getDynamoDbClient().send(command);
    });

  const updateConversationAlso =
    conversation.edited !== conversation.originalConversation.edited;

  const conversationToPersist: PersistedChatConversation = {
    ...conversationProvided,
    "table-key": tableKey,
  };
  delete conversationToPersist.messages;
  delete conversationToPersist.originalConversation;

  if (updateConversationAlso) {
    const command = new PutItemCommand({
      TableName: resourceSettings.dynamoDbTableName,
      Item: marshall(conversationToPersist),
    });
    updatePromises.push(getDynamoDbClient().send(command));
  }

  const allPromises = [...updatePromises, ...deletePromises];
  await Promise.all(allPromises);
}

async function saveNew(conversation: ChatConversation) {
  const tableKey = getChatConversationTableKey(
    conversation.modelId,
    conversation.id,
  );

  const updatePromises = conversation.messages.map((currentMessage) => {
    const command = new PutItemCommand({
      TableName: resourceSettings.dynamoDbTableName,
      Item: marshall({ ...currentMessage, "table-key": tableKey }),
    });
    return getDynamoDbClient().send(command);
  });

  const conversationToPersist: PersistedChatConversation = {
    ...conversation,
    "table-key": tableKey,
  };
  delete conversationToPersist.messages;
  delete conversationToPersist.originalConversation;

  const command = new PutItemCommand({
    TableName: resourceSettings.dynamoDbTableName,
    Item: marshall(conversationToPersist),
  });

  updatePromises.push(getDynamoDbClient().send(command));

  await Promise.all(updatePromises);
}
