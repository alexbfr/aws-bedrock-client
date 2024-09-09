import { ChatTreeBranch } from "../../model/chatTreeBranch.ts";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { ChatTreeLeaf } from "../../model/chatTreeLeaf.ts";
import { Remove } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { useChatTreeStore } from "../../model/chatTreeStore.ts";
import styles from "./RenderChatTree.module.css";
import { useNavigate } from "react-router-dom";
import { makeChatRoute } from "../../routes/AppRoutes.tsx";
import { useChatConversationStore } from "../../model/chatConversationStore.ts";
import { ContextMenuActions } from "../../../context-menu/ContextMenuActions.tsx";
import { useChatManagement } from "../../services/useChatManagement.service.ts";
import { NewChatInfoDialog } from "./NewChatInfoDialog.tsx";
import { NewFolderDialog } from "./NewFolderDialog.tsx";

type RenderChatTreeProps = Readonly<{
  level: number;
  root: ChatTreeBranch;
}>;

function findNewChatName(root: ChatTreeBranch) {
  for (let i = 1; ; i++) {
    const name = "New chat " + i;
    if (!root.elements.find((el) => (el as ChatTreeLeaf).chatName === name)) {
      return name;
    }
  }
}

export function RenderChatTree({ level, root }: RenderChatTreeProps) {
  const { addNewChat, addNewFolder, deleteChat } = useChatManagement();
  const { conversation } = useChatConversationStore();
  const { modelId } = useChatTreeStore();
  const navigate = useNavigate();
  const [showNewChat, setShowNewChat] = useState(false);
  const newChatName = findNewChatName(root);
  const [showNewFolder, setShowNewFolder] = useState(false);

  if (!modelId) {
    throw new Error("Uninitialized");
  }

  const createNewChat = useCallback(
    async (branch: ChatTreeBranch) => {
      await addNewChat(branch, newChatName);
      setShowNewChat(false);
    },
    [addNewChat, newChatName],
  );

  const createNewFolder = useCallback(
    async (folderName: string) => {
      await addNewFolder(root, folderName);
    },
    [addNewFolder, root],
  );

  return (
    <Box>
      {level !== 0 && (
        <div className={styles.branchNameContainer}>
          <Remove sx={{ mt: -0.5 }} />
          <Typography variant={"body2"}>
            <strong>{root.branchName}</strong>
          </Typography>
        </div>
      )}
      <List sx={{ ml: (level - 1) * 2 }} dense>
        {root.elements.map((element) => {
          if (((element as ChatTreeLeaf).chatName ?? null) !== null) {
            const className =
              element.id === conversation?.id
                ? styles.listItemSelected
                : styles.listItem;
            return (
              <ContextMenuActions
                key={element.id}
                actions={{
                  deleteChat: {
                    action: () => deleteChat(element as ChatTreeLeaf),
                    actionDescription: "Delete this chat",
                  },
                }}
              >
                <ListItem
                  className={className}
                  onClick={() => navigate(makeChatRoute(modelId, element.id))}
                >
                  <Typography noWrap className={styles.selectableChat}>
                    {(element as ChatTreeLeaf).chatName}
                  </Typography>
                </ListItem>
              </ContextMenuActions>
            );
          } else {
            return (
              <ListItem key={element.id}>
                <RenderChatTree
                  level={level + 1}
                  root={element as ChatTreeBranch}
                />
              </ListItem>
            );
          }
        })}
        <ListItem sx={{ ml: 0, mt: 0, mb: 0, pt: 0, pb: 0 }}>
          <Button
            size={"small"}
            color={"primary"}
            variant={"outlined"}
            onClick={() => setShowNewChat(true)}
            sx={{ mr: 1 }}
          >
            New Chat
          </Button>
          {/*<Button*/} {/* Disable new folder for now */}
          {/*  size={"small"}*/}
          {/*  color={"primary"}*/}
          {/*  variant={"outlined"}*/}
          {/*  onClick={() => setShowNewFolder(true)}*/}
          {/*>*/}
          {/*  New Folder*/}
          {/*</Button>*/}
        </ListItem>
      </List>
      {showNewChat && (
        <NewChatInfoDialog
          level={level}
          root={root}
          newChatName={newChatName}
          onClose={() => setShowNewChat(false)}
          onCreateNewChat={() => createNewChat(root)}
        />
      )}
      {showNewFolder && (
        <NewFolderDialog
          level={level}
          root={root}
          onClose={() => setShowNewFolder(false)}
          onCreateNewFolder={createNewFolder}
        />
      )}
    </Box>
  );
}
