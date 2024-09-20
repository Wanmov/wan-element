import type { Ref } from "vue";
import useEventListener from "./useEventListener";

export default function useClickoutside(
  eleRef: Ref<HTMLElement | void>,
  cb: (e: MouseEvent) => void
) {
  useEventListener(document, "click", (e) => {
    if (
      eleRef.value &&
      e.target &&
      !eleRef.value.contains(e.target as HTMLElement)
    ) {
      cb(e as MouseEvent);
    }
  });
}
