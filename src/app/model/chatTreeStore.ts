import {create} from "zustand";
import {makeChatTreeStore} from "./makeChatTreeStore.ts";

export const useChatTreeStore = create(makeChatTreeStore);
