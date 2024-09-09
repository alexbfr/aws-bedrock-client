import { useChatConversationStore } from "../model/chatConversationStore.ts";
import { useChatTreeStore } from "../model/chatTreeStore.ts";
import { ChatConversation } from "../model/chatConversation.ts";
import { useCallback } from "react";
import { saveChatConversation } from "../../aws-integration/services/saveChatConversation.service.ts";
import { ChatTreeLeaf } from "../model/chatTreeLeaf.ts";
import { saveChatTree } from "../../aws-integration/services/saveChatTree.service.ts";
import { deleteChatConversation } from "../../aws-integration/services/deleteChatConversation.service.ts";
import { makeChatRoute, makeModelRoute } from "../routes/AppRoutes.tsx";
import { useNavigate } from "react-router-dom";
import { ChatTreeBranch } from "../model/chatTreeBranch.ts";
import { ChatConversationMessage } from "../model/ChatConversationMessage.ts";

export function useChatManagement() {
  const navigate = useNavigate();

  const { conversation, setConversation, deleteMessagesFromInConversation } =
    useChatConversationStore();
  const { modelId, rootBranch, findNode, addNode, replaceNode, deleteNode } =
    useChatTreeStore();

  const addNewChat = useCallback(
    async (root: ChatTreeBranch, newChatName: string) => {
      const chatId = crypto.randomUUID();
      const now = Date.now().valueOf();

      const newChat: ChatTreeLeaf = {
        chatName: newChatName,
        created: now,
        id: chatId,
      };
      const newRootBranch = addNode(root, newChat);

      console.log(
        `Creating new conversation for modelIU ${modelId} and chatId ${chatId}`,
      );
      const conversation: ChatConversation = {
        modelId: modelId!,
        id: chatId,
        created: now,
        edited: now,
        messages: [],
        dtype: "conversation",
        title: newChatName,
      };
      await saveChatTree(modelId!, newRootBranch);
      await saveChatConversation(conversation);
      navigate(makeChatRoute(modelId!, chatId!));
    },
    [navigate, addNode, modelId],
  );

  const addNewFolder = useCallback(
    async (root: ChatTreeBranch, newFolderName: string) => {
      const folderId = crypto.randomUUID();
      const now = Date.now().valueOf();

      const newFolder: ChatTreeBranch = {
        elements: [],
        id: folderId,
        created: now,
        branchId: folderId,
        branchName: newFolderName,
      };
      const newRootBranch = addNode(root, newFolder);
      await saveChatTree(modelId!, newRootBranch);
    },
    [addNode, modelId],
  );

  const editChatConversation = useCallback(
    async (updatedConversation: Partial<ChatConversation>) => {
      const matchingChatTreeNode = findNode(updatedConversation.id!);
      if (!modelId) {
        throw new Error("modelId not set");
      }
      if (!rootBranch) {
        throw new Error("rootBranch not set");
      }
      if (!matchingChatTreeNode) {
        throw new Error(
          "Unknown conversation in tree: " + updatedConversation.id,
        );
      }
      if (((matchingChatTreeNode as ChatTreeLeaf).chatName ?? null) === null) {
        throw new Error("Unexpected node in tree: " + updatedConversation.id);
      }
      const matchingChatTreeLeaf = matchingChatTreeNode as ChatTreeLeaf;
      const modifiedConversation = {
        ...conversation,
        ...updatedConversation,
      } as ChatConversation;
      const updatedStoreConversation = setConversation(modifiedConversation)!;
      await saveChatConversation(updatedStoreConversation);
      const updatedChatTreeLeaf = {
        ...matchingChatTreeLeaf,
        chatName: updatedConversation.title,
      } as ChatTreeLeaf;
      const updatedRootBranch = replaceNode(
        matchingChatTreeLeaf,
        updatedChatTreeLeaf,
      );
      await saveChatTree(modelId, updatedRootBranch);
      return updatedStoreConversation;
    },
    [findNode, modelId, replaceNode, rootBranch, conversation, setConversation],
  );

  const deleteChat = useCallback(
    async (chatTreeLeaf: ChatTreeLeaf) => {
      if (!modelId) {
        throw new Error("modelId not set");
      }
      if (!rootBranch) {
        throw new Error("rootBranch not set");
      }
      if ((chatTreeLeaf.chatName ?? null) === null) {
        throw new Error("Unexpected node in tree: " + chatTreeLeaf.id);
      }
      await deleteChatConversation(modelId, chatTreeLeaf.id);
      const updatedRootBranch = deleteNode(chatTreeLeaf);
      await saveChatTree(modelId, updatedRootBranch);
      if (chatTreeLeaf.id === conversation?.id) {
        navigate(makeModelRoute(modelId));
      }
    },
    [navigate, modelId, rootBranch, conversation, deleteNode],
  );

  const deleteChatMessagesStartingFrom = useCallback(
    async (message: ChatConversationMessage) => {
      const updatedConversation = deleteMessagesFromInConversation(message.id);
      await saveChatConversation(updatedConversation);
    },
    [deleteMessagesFromInConversation],
  );

  return {
    addNewChat,
    addNewFolder,
    editChatConversation,
    deleteChat,
    deleteChatMessagesStartingFrom,
  };
}
