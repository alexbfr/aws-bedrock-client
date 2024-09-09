import styles from "./ChatContent.module.css";
import { useChatConversationStore } from "../../model/chatConversationStore.ts";
import { useCallback, useState } from "react";
import { HumanInputBox } from "./HumanInputBox.tsx";
import { Message } from "@aws-sdk/client-bedrock-runtime";
import { RenderConversation } from "./RenderConversation.tsx";
import { AssistantBox } from "./AssistantBox.tsx";
import { useConverseStream } from "../../services/useConverseStream.service.ts";
import { ContextMenu } from "../../../context-menu/ContextMenu.tsx";
import { EditableHeadline } from "./EditableHeadline.tsx";

export function ChatContent() {
  const { conversation } = useChatConversationStore();
  const [answering, setAnswering] = useState(false);
  const { converse } = useConverseStream();
  const [currentAssistantResponse, setCurrentAssistantResponse] =
    useState<Message | null>();
  if (!conversation) {
    throw new Error("Uninitialized");
  }

  const handleSubmit = useCallback(
    async (msg: Message): Promise<void> => {
      setAnswering(true);
      try {
        await converse(msg, setCurrentAssistantResponse);
      } finally {
        setAnswering(false);
      }
    },
    [converse],
  );

  return (
    <ContextMenu className={styles.rightPanel}>
      <EditableHeadline />
      <RenderConversation />
      {currentAssistantResponse && (
        <AssistantBox content={currentAssistantResponse.content} />
      )}
      {!answering && <HumanInputBox onSubmit={handleSubmit} />}
    </ContextMenu>
  );
}
