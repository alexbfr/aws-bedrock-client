import { useChatConversationStore } from "../model/chatConversationStore.ts";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading.tsx";
import { queryChatConversation } from "../../aws-integration/services/queryChatConversation.service.ts";
import { useChatTreeStore } from "../model/chatTreeStore.ts";
import { ChatTreeLeaf } from "../model/chatTreeLeaf.ts";
import { useNavigate } from "react-router-dom";
import { makeModelRoute } from "./AppRoutes.tsx";

interface InitChatProps {
  modelIdRequested: string;
  chatIdRequested: string;
  children: ReactNode;
}

interface LoadingState {
  loadingKey: string | null;
}

export function InitChat({
  modelIdRequested,
  chatIdRequested,
  children,
}: Readonly<InitChatProps>) {
  const navigate = useNavigate();
  const { findNode } = useChatTreeStore();
  const { conversation, setConversation } = useChatConversationStore();
  const [loadingForChatAndModelId] = useState<LoadingState>({
    loadingKey: null,
  });

  const loadConversation = useCallback(
    async (modelId: string, chatId: string) => {
      const foundInTree = findNode(chatId);
      if (!foundInTree || !(foundInTree as ChatTreeLeaf).chatName) {
        navigate(makeModelRoute(modelId));
        return;
      }
      const conversationLoaded = await queryChatConversation(modelId, chatId);
      if (conversationLoaded === null) {
        console.log(Error(`Conversation not found with id ${chatId}`));
        navigate(makeModelRoute(modelId));
      } else {
        setConversation(conversationLoaded);
      }
      loadingForChatAndModelId.loadingKey = null;
    },
    [findNode, navigate, loadingForChatAndModelId, setConversation],
  );

  useEffect(() => {
    if (
      conversation?.modelId !== modelIdRequested ||
      conversation?.id !== chatIdRequested
    ) {
      const loadingKey = `${modelIdRequested}-${chatIdRequested}`;
      if (loadingForChatAndModelId.loadingKey !== loadingKey) {
        loadingForChatAndModelId.loadingKey = loadingKey;
        loadConversation(modelIdRequested, chatIdRequested);
      }
    }
  }, [
    chatIdRequested,
    modelIdRequested,
    conversation,
    loadingForChatAndModelId,
    loadConversation,
  ]);

  if (loadingForChatAndModelId.loadingKey || !conversation) {
    return <Loading />;
  }

  return children;
}
