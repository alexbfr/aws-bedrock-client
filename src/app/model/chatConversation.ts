import { ChatConversationElement } from "./chatConversationElement.ts";
import {ChatConversationMessage} from "./ChatConversationMessage.ts";

export interface ChatConversation extends ChatConversationElement {
  dtype: "conversation";
  title: string;
  icon?: string;
  messages: ChatConversationMessage[];
}
