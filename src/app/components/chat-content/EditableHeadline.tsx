import { TextField, Typography } from "@mui/material";
import { createRef, useCallback, useEffect, useState } from "react";
import { useChatConversationStore } from "../../model/chatConversationStore.ts";
import { useChatManagement } from "../../services/useChatManagement.service.ts";

export function EditableHeadline() {
  const { conversation } = useChatConversationStore();
  const { editChatConversation } = useChatManagement();
  const [editing, setEditing] = useState(false);
  const [initializedEdit, setInitializedEdit] = useState(false);
  const editRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (editing && editRef.current && !initializedEdit && conversation) {
      setInitializedEdit(true);
      editRef.current.value = conversation.title;
      editRef.current.focus();
    }
  }, [editing, editRef, initializedEdit, conversation]);

  const handleBlur = useCallback(async () => {
    setEditing(false);
    setInitializedEdit(false);
    const title = editRef.current?.value;
    if (title) {
      console.log(title);
      await editChatConversation({...conversation, edited: Date.now().valueOf(), title})
    }
  }, [conversation, editChatConversation, editRef]);

  if (!conversation) {
    return <></>;
  }

  if (editing) {
    return (
      <TextField inputRef={editRef} onBlur={handleBlur} fullWidth></TextField>
    );
  }

  return (
    <Typography variant={"h5"} onClick={() => setEditing(true)}>
      {conversation.title}
    </Typography>
  );
}
