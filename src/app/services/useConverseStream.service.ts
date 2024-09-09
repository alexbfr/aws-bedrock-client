import {
  ConverseCommand,
  ConverseStreamCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";
import { getBedrockRuntimeClient } from "../../aws-integration/services/bedrockRuntimeClient.service.ts";
import { useChatConversationStore } from "../model/chatConversationStore.ts";
import { useCallback } from "react";
import { ChatConversation } from "../model/chatConversation.ts";
import { getTextContentFromContentBlocks } from "../../aws-integration/services/getTextContent.service.ts";
import { resourceSettings } from "../../aws-integration/services/awsCredentials.service.ts";
import { useChatManagement } from "./useChatManagement.service.ts";

export function useConverseStream() {
  const { addMessageToConversation, setConversation } =
    useChatConversationStore();
  const { editChatConversation } = useChatManagement();

  const converse = useCallback(
    async (
      msg: Message,
      onRenderPreview: (msg: Message | null) => void,
    ): Promise<ChatConversation> => {
      let currentConversation = addMessageToConversation(msg);

      const cmd = new ConverseStreamCommand({
        messages: currentConversation.messages.map((msg) => msg.content),
        modelId: currentConversation.modelId,
        inferenceConfig: {
          maxTokens: 4000,
        },
      });
      const response = await getBedrockRuntimeClient().send(cmd);
      let responseText = "";
      for await (const item of response.stream!) {
        if (item.contentBlockDelta?.delta?.text) {
          responseText += item.contentBlockDelta.delta?.text;
          onRenderPreview({
            role: "assistant",
            content: [{ text: responseText }],
          });
        }
      }
      onRenderPreview(null);
      currentConversation = addMessageToConversation({
        role: "assistant",
        content: [{ text: responseText }],
      });
      if (currentConversation.title.startsWith("New chat ")) {
        currentConversation = (await updateConversationTitle(
          currentConversation,
          setConversation,
        ))!;
      }
      await editChatConversation(currentConversation);
      return currentConversation;
    },
    [addMessageToConversation, editChatConversation, setConversation],
  );

  return { converse };
}

async function updateConversationTitle(
  conversation: ChatConversation,
  setConversation: (
    conversation: ChatConversation | null,
  ) => ChatConversation | null,
): Promise<ChatConversation | null> {
  const cmd = new ConverseCommand({
    messages: [
      {
        role: "user",
        content: [
          {
            text:
              "Briefly summarize the current discussion into a headline please. Do not respond with anything else but the headline, no certainly, no quotation marks, no all-caps, just the headline. The conversation now follows, enclosed by <conversation>...</conversation>::\n\n" +
              "<conversation>" +
              conversation.messages
                .map((msg) =>
                  getTextContentFromContentBlocks(msg.content.content),
                )
                .join("\n") +
              "</conversation>\n",
          },
        ],
      },
    ],
    modelId: resourceSettings.summarizeModelId,
    inferenceConfig: {
      maxTokens: 120,
    },
  });

  try {
    const response = await getBedrockRuntimeClient().send(cmd);
    return setConversation({
      ...conversation,
      title: getTextContentFromContentBlocks(response.output!.message!.content),
      edited: Date.now().valueOf(),
    });
  } catch {
    // Do nothing
  }
  return conversation;
}
