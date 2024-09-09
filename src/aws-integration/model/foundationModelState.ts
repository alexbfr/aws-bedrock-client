import {FoundationModelSummary} from "@aws-sdk/client-bedrock";

export interface FoundationModelState {
  models: FoundationModelSummary[];
  selectedModel: FoundationModelSummary | null;
  setModels: (models: FoundationModelSummary[]) => void;
  setSelectedModel: (model: FoundationModelSummary) => void;
}
