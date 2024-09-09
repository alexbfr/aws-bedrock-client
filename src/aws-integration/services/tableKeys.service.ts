function getChatTreeKey(modelId: string) {
  return `conversations-v1: ${modelId}`;
}

export const tableKeys = {
  getChatTreeKey,
};
