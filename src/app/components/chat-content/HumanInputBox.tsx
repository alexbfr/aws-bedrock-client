import { createRef, useCallback, useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { HumanBox } from "./HumanBox.tsx";
import { SendOutlined } from "@mui/icons-material";
import { Message } from "@aws-sdk/client-bedrock-runtime";

export function HumanInputBox({onSubmit} : {onSubmit: (msg: Message) => Promise<void>}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = createRef<HTMLInputElement>();
  const [timerState] = useState<{
    timerId: ReturnType<typeof setTimeout> | null;
  }>({ timerId: null });

  const updateText = useCallback(() => {
    if (inputRef.current) {
      setText(inputRef.current.value);
      return inputRef.current.value;
    } else {
      return text;
    }
  }, [text, inputRef]);

  const refreshText = useCallback(() => {
    updateText();
    timerState.timerId = setTimeout(refreshText, 1000);
  }, [timerState, updateText]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setSubmitting(true);
    try {
      const updatedText = updateText();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setText("");
      await onSubmit({role: "user", content: [{text: updatedText}]});
    } finally {
      setSubmitting(false);
    }
  }, [inputRef, updateText, onSubmit]);

  useEffect(() => {
    if (timerState.timerId === null) {
      refreshText();
    }
    return () => {
      clearTimeout(timerState.timerId ?? undefined);
      timerState.timerId = null;
    };
  }, [timerState, refreshText]);

  return (
    <>
      <HumanBox content={[{ text }]} />
      <TextField
        disabled={submitting}
        fullWidth
        inputRef={inputRef}
        multiline
        maxRows={3}
        onBlur={updateText}
        onKeyDown={evt => {
          inputRef.current?.scrollIntoView({});
          if (evt.ctrlKey && evt.key === 'Enter') {
            evt.preventDefault();
            evt.stopPropagation();
            handleSubmit();
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSubmit}>
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </>
  );
}
