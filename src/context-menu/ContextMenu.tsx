import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useContextMenuStore } from "../model/contextMenuStore.ts";
import { ContextMenuActionsType } from "../model/contextMenuActionsType.ts";

export const ContextMenu = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ children, ...props }, ref) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;
  const { get, setHandler } = useContextMenuStore();
  const [actions] = useState<{ actions: ContextMenuActionsType | null }>({
    actions: null,
  });
  const [mousePosition, setMousePosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
    setMousePosition(null);
    actions.actions = null;
  };

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const currentActions = get(event.currentTarget);
      if (currentActions) {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMousePosition({ top: event.clientY, left: event.clientX });
        actions.actions = currentActions;
      }
    },
    [actions, get],
  );

  const handleMenuItemClick = async (action: () => Promise<void>) => {
    await action();
    handleClose();
  };

  setHandler(handleContextMenu);

  function checkIfDisabled(disabled: (() => boolean) | undefined | boolean) {
    if (!disabled) {
      return false;
    }
    return typeof disabled === "boolean" ? disabled : disabled();
  }

  return (
    <div {...props} ref={ref}>
      {children}
      {open && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorPosition={mousePosition ?? undefined}
          {...(mousePosition
            ? { anchorReference: "anchorPosition" as const }
            : {})}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {actions.actions &&
            Object.entries(actions.actions).map(
              ([key, { actionDescription, action, disabled, tooltip }]) => {
                const isDisabled = checkIfDisabled(disabled);
                const menuItem = (
                  <MenuItem
                    key={key}
                    onClick={() => handleMenuItemClick(action)}
                    disabled={isDisabled}
                  >
                    {typeof actionDescription === "string" ? (
                      <Typography>{actionDescription}</Typography>
                    ) : (
                      actionDescription
                    )}
                  </MenuItem>
                );

                if (tooltip) {
                  return <Tooltip key={key} title={tooltip}><div>{menuItem}</div></Tooltip>;
                } else {
                  return menuItem;
                }
              },
            )}
        </Menu>
      )}
    </div>
  );
});
