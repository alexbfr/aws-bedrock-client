import { Message } from "@aws-sdk/client-bedrock-runtime";
import styles from "./HumanBox.module.css";
import { Box } from "@mui/material";
import { RenderContentBlock } from "./RenderContentBlock.tsx";
import { PersonOutline } from "@mui/icons-material";
import { ContextMenuActions } from "../../../context-menu/ContextMenuActions.tsx";
import { getTextContentFromContentBlocks } from "../../../aws-integration/services/getTextContent.service.ts";

export function HumanBox({ content }: Readonly<Partial<Message>>) {
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
      <Box className={styles.humanBox}>
        <PersonOutline sx={{ pt: 1 }} />
        <div className={styles.content}>
          {content!.map((cb, idx) => (
            <RenderContentBlock key={idx} cb={cb} />
          ))}
        </div>
      </Box>
    </ContextMenuActions>
  );
}
