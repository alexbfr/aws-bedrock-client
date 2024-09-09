import { useChatConversationStore } from "../../model/chatConversationStore.ts";
import { AssistantBox } from "./AssistantBox.tsx";
import { HumanBox } from "./HumanBox.tsx";
import { ContextMenuActions } from "../../../context-menu/ContextMenuActions.tsx";
import { ChatConversationMessage } from "../../model/ChatConversationMessage.ts";
import { useChatManagement } from "../../services/useChatManagement.service.ts";
import {Typography} from "@mui/material";
import {ContextMenuActionsType} from "../../../model/contextMenuActionsType.ts";

function ChatMessage({ msg }: Readonly<{ msg: ChatConversationMessage }>) {
  if (msg.content.role === "assistant") {
    return <AssistantBox key={msg.id} content={msg.content.content} />;
  } else if (msg.content.role === "user") {
    return <HumanBox key={msg.id} content={msg.content.content} />;
  } else {
    throw new Error("Unknown role " + msg.content.role);
  }
}

export function RenderConversation() {
  const { conversation } = useChatConversationStore();
  const { deleteChatMessagesStartingFrom } = useChatManagement();

  function getActions(msg: ChatConversationMessage): ContextMenuActionsType {
    const byUser = msg.content.role === "user";
    return {
      deleteFromHere: {
        action: () => deleteChatMessagesStartingFrom(msg),
        actionDescription: "Delete all messages starting here",
        disabled: !byUser,
        tooltip: <Typography>Assistant messages cannot be deleted - delete the preceding user message instead</Typography>
        // tooltip: !byUser ? <Typography>Assistant messages cannot be deleted - delete the prior user message</Typography> : null
      },
    };
  }

  return (
    <>
      {conversation?.messages.map((msg) => (
        <ContextMenuActions key={msg.id} actions={getActions(msg)}>
          <ChatMessage msg={msg} />
        </ContextMenuActions>
      ))}
    </>
  );
}
