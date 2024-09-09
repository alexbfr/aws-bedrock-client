import { ChatTreeNode } from "./chatTreeNode.ts";

export interface ChatTreeLeaf extends ChatTreeNode {
  chatName: string;
}
