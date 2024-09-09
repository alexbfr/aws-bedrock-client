import { ChatConversationElement } from "./chatConversationElement.ts";
import { Message } from "@aws-sdk/client-bedrock-runtime";

export interface ChatConversationMessage extends ChatConversationElement {
  dtype: "message";
  content: Message;
}
