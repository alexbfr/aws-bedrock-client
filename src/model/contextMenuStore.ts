import { ContextMenuActionsType } from "./contextMenuActionsType.ts";
import { useCallback } from "react";

const idMap = new WeakMap<HTMLElement, ContextMenuActionsType>();

let openContextMenu: (evt: React.MouseEvent<HTMLElement>) => void = () =>
  void 0;

export function useContextMenuStore() {
  const add = useCallback(
    (toWhat: HTMLElement, actions: ContextMenuActionsType) => {
      idMap.set(toWhat, actions);
    },
    [],
  );

  const get = useCallback(
    (fromWhat: HTMLElement): ContextMenuActionsType | null => {
      let actions: ContextMenuActionsType = {};
      let current: HTMLElement | null = fromWhat;
      let found = false;
      while (current) {
        const currentActions = idMap.get(current);
        if (currentActions) {
          actions = { ...currentActions, ...actions };
          found = true;
        }
        current = current.parentElement;
      }
      return found ? actions : null;
    },
    [],
  );

  const setHandler = useCallback(
    (handler: (evt: React.MouseEvent<HTMLElement>) => void) => {
      openContextMenu = handler;
    },
    [],
  );

  return { add, get, open: openContextMenu, setHandler: setHandler };
}
