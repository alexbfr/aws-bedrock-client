import { useNavigate, useParams } from "react-router-dom";
import {InitChat} from "./InitChat.tsx";
import {ChatContent} from "../components/chat-content/ChatContent.tsx";

interface ChatRouteTargetProps extends Record<string, string> {
  modelId: string;
  chatId: string;
}

export function ChatRouteTarget() {
  const { chatId, modelId } = useParams<ChatRouteTargetProps>();

  const navigate = useNavigate();
  if (!modelId) {
    navigate("/");
    return <></>;
  }
  if (!chatId) {
    navigate("/chats/" + modelId);
    return <></>;
  }

  return <InitChat modelIdRequested={modelId} chatIdRequested={chatId}>
    <ChatContent />
  </InitChat>
}
