import styles from "./ChooseModel.module.css";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useFoundationModelsStore } from "../../aws-integration/model/foundationModelStore.ts";
import { useNavigate } from "react-router-dom";
import { makeModelRoute } from "../routes/AppRoutes.tsx";
import { useChatConversationStore } from "../model/chatConversationStore.ts";

export function ChooseModel() {
  const { models, selectedModel, setSelectedModel } =
    useFoundationModelsStore();
  const { conversation, setConversation } = useChatConversationStore();
  const navigate = useNavigate();

  if (conversation) {
    setConversation(null);
  }

  function changeSelectedModel(modelId: string) {
    const matchingModel = models.find((model) => model.modelId === modelId);
    if (matchingModel) {
      setSelectedModel(matchingModel);
    }
  }

  function navigateToSelectedModel() {
    const modelId = selectedModel?.modelId;
    if (modelId) {
      navigate(makeModelRoute(modelId));
    }
  }

  return (
    <div className={styles.chooseModelContainer}>
      <div className={styles.spacer} />
      <div className={styles.chooseModel}>
        <Typography variant={"h4"}>Choose model</Typography>
        <Box mt={2}>
          <Select
            className={styles.modelSelector}
            value={selectedModel?.modelId ?? ""}
            onChange={(evt) => changeSelectedModel(evt.target.value)}
          >
            {models.map((model) => (
              <MenuItem key={model.modelId} value={model.modelId}>
                {model.modelName}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {selectedModel && (
          <Box mt={2}>
            <Button
              variant={"contained"}
              color={"success"}
              onClick={navigateToSelectedModel}
            >
              Start
            </Button>
          </Box>
        )}
      </div>
      <div className={styles.spacer} />
    </div>
  );
}
