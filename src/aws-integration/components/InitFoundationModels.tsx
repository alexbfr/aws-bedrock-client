import {ReactNode, useEffect, useState} from "react";
import {useFoundationModelsStore} from "../model/foundationModelStore.ts";
import {fetchModels} from "../services/fetchFoundationModels.service.ts";

export function InitFoundationModels({children}: Readonly<{ children: ReactNode }>) {

  const {models, setModels} = useFoundationModelsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      fetchModels().then(result => setModels(result))
    }
  }, [initialized, setModels]);

  if (!models) {
    return <></>;
  }

  return children;
}
