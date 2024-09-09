import {
  cloneElement,
  forwardRef,
  ReactElement,
  Ref,
  useImperativeHandle,
  useState,
} from "react";
import { ContextMenuActionsType } from "../model/contextMenuActionsType.ts";
import { useContextMenuStore } from "../model/contextMenuStore.ts";

interface WrapperProps {
  children: ReactElement;
  actions: ContextMenuActionsType;
}

export const ContextMenuActions = forwardRef<HTMLDivElement, WrapperProps>(
  ({ children, actions }, ref: Ref<HTMLDivElement>) => {
    const { add, open } = useContextMenuStore();
    const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => wrapperRef!, [wrapperRef]);
    if (wrapperRef) {
      add(wrapperRef, actions);
    }

    return (
      <div ref={setWrapperRef} onContextMenu={open}>
        {cloneElement(children, {
          // You can pass any additional props to the child component if needed
        })}
      </div>
    );
  },
);
