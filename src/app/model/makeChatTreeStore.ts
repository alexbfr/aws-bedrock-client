import { ChatTreeState } from "./chatTreeState.ts";
import { ChatTreeBranch } from "./chatTreeBranch.ts";
import { ChatTreeNode } from "./chatTreeNode.ts";
import { ChatTreeLeaf } from "./chatTreeLeaf.ts";
import { StateCreator } from "zustand";

type Found = {
  parent: ChatTreeBranch;
  node: ChatTreeNode;
  index: number;
};

type CloneResult = {
  cloned: ChatTreeBranch;
  found?: Found;
};

function find(branch: ChatTreeBranch, findId: string): ChatTreeNode | null {
  if (branch.id === findId) {
    return branch;
  }
  const found = branch.elements.find((element) => element.id === findId);
  if (found) {
    return found;
  }
  for (const element of branch.elements) {
    if ((element as ChatTreeBranch).elements) {
      const foundInSubBranch = find(element as ChatTreeBranch, findId);
      if (foundInSubBranch) {
        return foundInSubBranch;
      }
    }
  }
  return null;
}

function clone(branch: ChatTreeBranch, find: ChatTreeNode): CloneResult {
  const result: ChatTreeBranch = { ...branch, elements: [] };
  const cloneResult: CloneResult = {
    cloned: result,
  };

  result.elements = branch.elements.map((element, idx) => {
    let clonedElement: ChatTreeNode | null = null;
    if ((element as ChatTreeBranch).branchId) {
      const clonedBranch = clone(element as ChatTreeBranch, find);
      if (clonedBranch.found) {
        cloneResult.found = clonedBranch.found;
      }
      clonedElement = clonedBranch.cloned;
    } else {
      clonedElement = { ...(element as ChatTreeLeaf) };
    }

    if (clonedElement.id === find.id) {
      cloneResult.found = {
        node: clonedElement,
        index: idx,
        parent: result,
      };
    }

    return clonedElement;
  });

  return cloneResult;
}

export const makeChatTreeStore: StateCreator<ChatTreeState> = (
  set: (what: Partial<ChatTreeState>) => void,
  get: () => ChatTreeState,
): ChatTreeState => ({
  rootBranch: null,
  modelId: null,
  findNode: (id: string) => find(get().rootBranch!, id),
  addNode: (parent, newNode) => {
    const rootBranch = get().rootBranch;
    if (!rootBranch) {
      throw new Error("No root branch");
    }
    const cloneResult = clone(rootBranch, parent);
    if (parent.id === rootBranch.id) {
      cloneResult.cloned.elements.push(newNode);
    } else {
      if (!cloneResult.found) {
        throw new Error("Couldn't find element with id");
      }
      (cloneResult.found.node as ChatTreeBranch).elements.push(newNode);
    }
    set({ rootBranch: cloneResult.cloned });
    return cloneResult.cloned;
  },
  deleteNode: (nodeToDelete) => {
    const rootBranch = get().rootBranch;
    if (!rootBranch) {
      throw new Error("No root branch");
    }
    const cloneResult = clone(rootBranch, nodeToDelete);
    if (!cloneResult.found) {
      throw new Error("Element to delete not found");
    }
    cloneResult.found.parent.elements.splice(cloneResult.found.index, 1);
    set({ rootBranch: cloneResult.cloned });
    return cloneResult.cloned;
  },
  replaceNode: (nodeToReplace, newNode: ChatTreeNode) => {
    const rootBranch = get().rootBranch;
    if (!rootBranch) {
      throw new Error("No root branch");
    }
    const cloneResult = clone(rootBranch, nodeToReplace);
    if (!cloneResult.found) {
      throw new Error("Element to delete not found");
    }
    cloneResult.found.parent.elements.splice(
      cloneResult.found.index,
      1,
      newNode,
    );
    set({ rootBranch: cloneResult.cloned });
    return cloneResult.cloned;
  },
  setRootBranch: (newModelId, newRootBranch) =>
    set({ modelId: newModelId, rootBranch: newRootBranch }),
});
