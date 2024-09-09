import {ChatTreeNode} from "./chatTreeNode.ts";

export interface ChatTreeBranch extends ChatTreeNode {
  branchId: string;
  branchName: string;
  elements: ChatTreeNode[];
}
