import { useChatTreeStore } from "../model/chatTreeStore.ts";
import { queryChatTree } from "../../aws-integration/services/queryChatTree.service.ts";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { ChatTreeBranch } from "../model/chatTreeBranch.ts";
import { saveChatTree } from "../../aws-integration/services/saveChatTree.service.ts";
import { Loading } from "../components/Loading.tsx";
import { useFoundationModelsStore } from "../../aws-integration/model/foundationModelStore.ts";

type InitChatTreeProps = Readonly<{
  children: ReactNode;
}>;

export function InitChatTree({ children }: InitChatTreeProps) {
  const { selectedModel } = useFoundationModelsStore();
  const modelIdExpected = selectedModel!.modelId!;
  const { modelId, rootBranch, setRootBranch } = useChatTreeStore();
  const [loading, setLoading] = useState(false);

  const init = useCallback(async () => {
    if (modelId !== modelIdExpected) {
      setLoading(true);
      const loaded = await queryChatTree(modelIdExpected);
      if (!loaded) {
        const newRootBranch: ChatTreeBranch = {
          branchId: "root",
          created: 0,
          branchName: "Root",
          id: "root",
          elements: [],
        };
        setRootBranch(modelIdExpected, newRootBranch);
        await saveChatTree(modelIdExpected, newRootBranch);
        setLoading(false);
      } else {
        setRootBranch(modelIdExpected, loaded);
        setLoading(false);
      }
    }
  }, [modelId, modelIdExpected, setRootBranch]);

  useEffect(() => {
    if (!loading && modelId !== modelIdExpected) {
      init();
    }
  }, [init, loading, modelId, modelIdExpected]);

  if (loading || !rootBranch || !modelId) {
    return <Loading />;
  }

  return children;
}
