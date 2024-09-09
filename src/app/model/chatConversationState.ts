import { ChatConversation } from "./chatConversation.ts";
import { Message } from "@aws-sdk/client-bedrock-runtime";

export interface ChatConversationState {
  conversation: ChatConversation | null;
  setConversation: (
    conversation: ChatConversation | null,
  ) => ChatConversation | null;
  addMessageToConversation: (message: Message) => ChatConversation;
  editMessageInConversation: (id: string, updatedMessage: Message) => ChatConversation;
  deleteMessagesFromInConversation: (id: string) => ChatConversation;
}
