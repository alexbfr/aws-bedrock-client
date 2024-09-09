import { ContentBlock } from "@aws-sdk/client-bedrock-runtime";

export function getTextContentFromContentBlocks(contents?: ContentBlock[]) {
  if (!contents) {
    return "";
  }
  return contents
    .filter((c) => c.text)
    .map((c) => c.text)
    .join("");
}
