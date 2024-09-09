import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ChatTreeBranch } from "../../model/chatTreeBranch.ts";

export function NewChatInfoDialog({
  level,
  newChatName,
  root,
  onClose,
  onCreateNewChat,
}: Readonly<{
  level: number;
  root: ChatTreeBranch;
  newChatName: string;
  onClose: () => void;
  onCreateNewChat: () => void;
}>) {
  return (
    <Dialog open={true}>
      <DialogTitle>
        {level === 0 ? "New chat" : "New chat in group"}
      </DialogTitle>
      <DialogContent>
        A new chat named "{newChatName}" will be created
        {level === 0
          ? " at the root level"
          : ' below folder "' + root.branchName + '"'}
        .
      </DialogContent>
      <DialogActions>
        <Button color={"info"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color={"success"}
          variant={"contained"}
          onClick={onCreateNewChat}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
