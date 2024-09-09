import {create} from "zustand";
import {FoundationModelState} from "./foundationModelState.ts";

export const useFoundationModelsStore = create<FoundationModelState>((set, get) => ({
  models: [],
  selectedModel: null,
  setModels: (models) => set({models}),
  setSelectedModel: (model) => {
    if ((model ?? null) !== (get().selectedModel ?? null)) {
      console.log("Foundation model changed: ", model);
      set({selectedModel: model})
    }
  }
}));
