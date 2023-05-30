import { useEffect } from "react";

export function useAsyncEffect(
  effect: () => Promise<void>,
  deps: ReadonlyArray<unknown>
) {

  useEffect(() => {
    effect();
  }, deps);

}
