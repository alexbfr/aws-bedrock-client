import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ChatTreeBranch } from "../../model/chatTreeBranch.ts";
import { useCallback, useEffect, useRef, useState } from "react";

export function NewFolderDialog({
  level,
  root,
  onClose,
  onCreateNewFolder,
}: Readonly<{
  level: number;
  root: ChatTreeBranch;
  onClose: () => void;
  onCreateNewFolder: (folderName: string) => void;
}>) {
  const [newFolderName, setNewFolderName] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [count, setCount] = useState(0);
  const [helperText, setHelperText] = useState<string | null>(null);
  const folderNameInputRef = useRef<HTMLInputElement>(null);

  const updateFolderName = useCallback(
    (evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewFolderName(evt.target.value!);
    },
    [],
  );

  const handleCreateNewFolder = useCallback(() => {
    if (newFolderName.trim() === "") {
      setHelperText("Please provide a name for the new folder");
    } else {
      onCreateNewFolder(newFolderName.trim());
    }
  }, [newFolderName, onCreateNewFolder]);

  useEffect(() => {
    if (!initialized && folderNameInputRef.current) {
      setInitialized(true);
      folderNameInputRef.current.focus();
    } else {
      if (!folderNameInputRef.current) {
        setCount(count + 1); // Force re-render to workaround inputRef issue in MUI 6.0.2
      }
    }
  }, [count, initialized, folderNameInputRef]);

  return (
    <Dialog open={true}>
      <DialogTitle>{level === 0 ? "New folder" : "New sub-folder"}</DialogTitle>
      <DialogContent onClick={() => setCount(count + 1)}>
        A new folder will be created
        {level === 0
          ? " at the root level"
          : ' below folder "' + root.branchName + '"'}
        . Please choose a name:
        <TextField
          fullWidth
          inputRef={folderNameInputRef}
          onBlur={updateFolderName}
          error={!!helperText}
          helperText={helperText}
          onFocus={() => setHelperText(null)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button color={"info"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color={"success"}
          variant={"contained"}
          onClick={() => handleCreateNewFolder()}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
