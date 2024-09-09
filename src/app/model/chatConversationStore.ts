import { create } from "zustand";
import { ChatConversationState } from "./chatConversationState.ts";
import { ChatConversationMessage } from "./ChatConversationMessage.ts";
import { ChatConversation } from "./chatConversation.ts";

export const useChatConversationStore = create<ChatConversationState>(
  (set, get) => ({
    conversation: null,
    setConversation: (conversation) => {
      set({ conversation });
      return conversation;
    },
    addMessageToConversation: (message) => {
      const conversation = get().conversation;
      if (!conversation) {
        throw new Error("Conversation must already exist");
      }
      const newMessage: ChatConversationMessage = {
        dtype: "message",
        created: Date.now().valueOf(),
        edited: null,
        id: crypto.randomUUID(),
        modelId: conversation.modelId,
        content: message,
      };
      const newConversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
      };
      set({
        conversation: newConversation,
      });
      return newConversation;
    },
    editMessageInConversation: (id, updatedMessage) => {
      const conversation = get().conversation;
      if (!conversation) {
        throw new Error("Conversation must already exist");
      }
      const oldMessage = conversation.messages.find((msg) => msg.id === id);
      if (!oldMessage) {
        throw new Error(`Old message with id ${id} not found`);
      }
      const edited = Date.now().valueOf();
      const newMessage: ChatConversationMessage = {
        ...oldMessage,
        edited,
        content: updatedMessage,
      };
      const newMessages = conversation.messages.map((msg) =>
        msg.id === id ? newMessage : msg,
      );
      const newConversation: ChatConversation = {
        ...conversation,
        edited,
        messages: newMessages,
      };
      set({ conversation: newConversation });
      return newConversation;
    },
    deleteMessagesFromInConversation: (id) => {
      const conversation = get().conversation;
      if (!conversation) {
        throw new Error("Conversation must already exist");
      }
      const oldMessageIndex = conversation.messages.findIndex(
        (msg) => msg.id === id,
      );
      if (oldMessageIndex < 0) {
        throw new Error(`Old message with id ${id} not found`);
      }
      const edited = Date.now().valueOf();
      const newMessages = [...conversation.messages];
      newMessages.splice(oldMessageIndex);
      const newConversation: ChatConversation = {
        ...conversation,
        edited,
        messages: newMessages,
      };
      set({ conversation: newConversation });
      return newConversation;
    },
  }),
);
