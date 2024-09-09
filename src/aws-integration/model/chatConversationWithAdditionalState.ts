import { ChatConversation } from "../../app/model/chatConversation.ts";

export interface ChatConversationWithAdditionalState extends ChatConversation {
  originalConversation?: ChatConversation;
  "table-key" ?: string;
}
