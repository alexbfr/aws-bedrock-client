import { ReactNode } from "react";

export type ContextMenuActionsType = {
  [actionKey: string]: {
    disabled?: boolean | (() => boolean);
    actionDescription: ReactNode;
    action: () => Promise<void>;
    tooltip?: ReactNode;
  };
};