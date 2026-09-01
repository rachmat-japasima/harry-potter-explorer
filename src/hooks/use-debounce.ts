import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a debounced version of `callback`: the last invocation wins and
 * it fires only `delayMs` after the previous one (trailing edge). The
 * returned function's identity is stable across renders; `callback` is
 * always the freshest one passed. The pending timer is cleared on unmount.
 *
 * Per the design brief: no third-party debounce library.
 */

export function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs],
  );
}