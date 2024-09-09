export function getChatConversationTableKey(
  modelId: string,
  chatId: string,
) {
  return `conversation-messages-v1: ${chatId}-${modelId}`;
}
