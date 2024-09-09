import { Message } from "@aws-sdk/client-bedrock-runtime";
import styles from "./AssistantBox.module.css";
import { Box } from "@mui/material";
import { RenderContentBlock } from "./RenderContentBlock.tsx";
import { SmartToyOutlined } from "@mui/icons-material";
import { getTextContentFromContentBlocks } from "../../../aws-integration/services/getTextContent.service.ts";
import { ContextMenuActions } from "../../../context-menu/ContextMenuActions.tsx";

export function AssistantBox({ content }: Readonly<Partial<Message>>) {
  async function handleCopy() {
    await navigator.clipboard.writeText(
      getTextContentFromContentBlocks(content),
    );
  }

  return (
    <ContextMenuActions
      actions={{
        copy: {
          action: handleCopy,
          actionDescription: "Copy as markdown",
        },
      }}
    >
      <Box className={styles.assistantBox}>
        <SmartToyOutlined sx={{ pt: 1 }} />
        <div className={styles.content}>
          {content!.map((cb, idx) => (
            <RenderContentBlock key={idx} cb={cb} />
          ))}
        </div>
      </Box>
    </ContextMenuActions>
  );
}
