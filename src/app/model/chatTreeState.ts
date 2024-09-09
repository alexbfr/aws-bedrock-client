import { ChatTreeBranch } from "./chatTreeBranch.ts";
import { ChatTreeNode } from "./chatTreeNode.ts";

export interface ChatTreeState {
  modelId: string | null;
  rootBranch: ChatTreeBranch | null;
  findNode: (id: string) => ChatTreeNode | null;
  addNode: (parent: ChatTreeBranch, newNode: ChatTreeNode) => ChatTreeBranch;
  deleteNode: (nodeToDelete: ChatTreeNode) => ChatTreeBranch;
  replaceNode: (nodeToReplace: ChatTreeNode, newNode: ChatTreeNode) => ChatTreeBranch;
  setRootBranch: (
    newModelId: string | null,
    newRootBranch: ChatTreeBranch | null,
  ) => void;
}
