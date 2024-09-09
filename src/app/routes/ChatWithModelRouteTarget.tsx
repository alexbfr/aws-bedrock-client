import { useNavigate, useParams } from "react-router-dom";
import { ChatWithModel } from "../components/ChatWithModel.tsx";
import { InitChatTree } from "./InitChatTree.tsx";
import { useFoundationModelsStore } from "../../aws-integration/model/foundationModelStore.ts";
import { useChatConversationStore } from "../model/chatConversationStore.ts";
import { useEffect } from "react";

interface ChatWithModelRouteTargetParams extends Record<string, string> {
  modelId: string;
}

export function ChatWithModelRouteTarget() {
  const { modelId } = useParams<ChatWithModelRouteTargetParams>();
  const { selectedModel, setSelectedModel, models } =
    useFoundationModelsStore();
  const { conversation, setConversation } = useChatConversationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedModel?.modelId !== modelId) {
      const model = models.find((m) => m.modelId === modelId)!;
      setSelectedModel(model);
      if (conversation) {
        setConversation(null);
      }
    }
  }, [
    selectedModel,
    conversation,
    modelId,
    models,
    setConversation,
    setSelectedModel,
  ]);

  if (!modelId) {
    navigate("/");
    return <></>;
  }

  if (selectedModel?.modelId !== modelId) {
    return <></>;
  }

  return (
    <InitChatTree>
      <ChatWithModel />
    </InitChatTree>
  );
}
