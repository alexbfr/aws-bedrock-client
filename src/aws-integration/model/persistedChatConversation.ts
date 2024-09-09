import {ChatConversationWithAdditionalState} from "./chatConversationWithAdditionalState.ts";

export type PersistedChatConversation = Partial<ChatConversationWithAdditionalState> & {
  "table-key": string;
};
