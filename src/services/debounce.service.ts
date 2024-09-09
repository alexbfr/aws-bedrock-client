import { useCallback } from "react";

type DebounceInfo = {
  timerId: ReturnType<typeof setTimeout>;
};

const debounces = new Map<string, DebounceInfo>();

export function useDebounce(key: string, msec: number) {
  return useCallback(
    (fn: () => void) => {
      const existingDebounce = debounces.get(key);
      if (existingDebounce) {
        clearTimeout(existingDebounce.timerId);
      }
      const newDebounce: DebounceInfo = {
        timerId: setTimeout(fn, msec),
      };
      debounces.set(key, newDebounce);
    },
    [key, msec],
  );
}
