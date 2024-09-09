import { useFoundationModelsStore } from "../../../aws-integration/model/foundationModelStore.ts";
import { useChatTreeStore } from "../../model/chatTreeStore.ts";
import styles from "./SelectChatPanel.module.css";
import { Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { RenderChatTree } from "./RenderChatTree.tsx";
import { FirstPageOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ContextMenu } from "../../../context-menu/ContextMenu.tsx";

export function SelectChatPanel() {
  const navigate = useNavigate();
  const { selectedModel } = useFoundationModelsStore();
  const { rootBranch } = useChatTreeStore();

  return (
    <ContextMenu className={styles.selectChatPanel}>
      <div>
        <Typography variant={"h5"}>Past Chats</Typography>
      </div>
      <div className={styles.modelName}>
        <Tooltip title={"Change"} onClick={() => navigate("/")}>
          <IconButton size="small">
            <FirstPageOutlined />
          </IconButton>
        </Tooltip>

        <Typography>{selectedModel?.modelName}</Typography>
      </div>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <RenderChatTree level={0} root={rootBranch!} />
    </ContextMenu>
  );
}
