export interface ChatConversationElement {
  dtype: 'conversation' | 'message';
  created: number;
  edited: number | null;
  modelId: string;
  id: string;
}
