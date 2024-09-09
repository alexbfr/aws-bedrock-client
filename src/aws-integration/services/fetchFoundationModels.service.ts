import {FoundationModelSummary, ListFoundationModelsCommand} from "@aws-sdk/client-bedrock";
import {getBedrockClient} from "./bedrockClient.service.ts";

export async function fetchModels() {

  const response = (await getBedrockClient().send(new ListFoundationModelsCommand(({})))).modelSummaries!;

  response.sort((a1, a2) => (a1.modelName! + " " + a1.modelId).localeCompare(a2.modelName! + " " + a2.modelId))
  let previous: FoundationModelSummary | null = null;
  const modelNamesToAugment = new Set<string>();

  response.forEach(model => {
    if (previous?.modelName === model.modelName) {
      modelNamesToAugment.add(model.modelName!);
    }
    previous = model;
  });

  response.forEach(model => {
    if (modelNamesToAugment.has(model.modelName!)) {
      model.modelName += " " + model.modelId;
    }
  });

  return response;
}

