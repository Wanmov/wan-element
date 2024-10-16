import type { LoadingOptions, LoadingOptionsResolved } from "./types";
import { ref, createApp, reactive, nextTick } from "vue";
import { defer, isNil, isString } from "lodash-es";
import { useZIndex } from "@wan-element/hooks";
import LoadingComp from "./Loading.vue";

const RELATIVE_CLASS = "wan-loading-parent--relative" as const;
const HIDDEN_CLASS = "wan-loading-parent--hiden" as const;
const LOADING_NUMB_KEY = "wan-loading-numb" as const;

const instanceMap: Map<HTMLElement, LoadingInstance> = new Map();
const { nextZIndex } = useZIndex(3000);

function createLoading(opts: LoadingOptionsResolved) {
  const visible = ref(opts.visible);
  const afterLeaveFlag = ref(false);
  const handleAfterLeave = () => {
    if (!afterLeaveFlag.value) return;
    destory();
  };

  const data = reactive({
    ...opts,
    onAfterLeave: handleAfterLeave,
  });

  const setText = (text: string) => (data.text = text);

  const destory = () => {
    const target = data.parent;
    updateLoadingNumb(target, "sub");
    if (getLoadingNumb(target)) return;
    nextTick(() => {
      toggleClass(target, RELATIVE_CLASS, "remove");
      toggleClass(target, HIDDEN_CLASS, "remove");
    });
    instanceMap.delete(target ?? document.body);
    vm.$el?.parentNode?.removeChild(vm.$el);
    app.unmount();
  };

  let afterLeaveTimer: number;
  const close = () => {
    if (opts.beforeClose && !opts.beforeClose()) return;

    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    afterLeaveTimer = defer(handleAfterLeave);

    visible.value = false;
    opts.closed?.();
  };

  const app = createApp(LoadingComp, {
    ...data,
    zIndex: data.fullscreen ? nextZIndex() : void 0,
    visible,
  });
  const vm = app.mount(document.createElement("div"));

  return {
    get $el(): HTMLElement {
      return vm.$el;
    },
    vm,
    close,
    visible,
    setText,
  };
}

function resolveOptions(opts: LoadingOptions): LoadingOptionsResolved {
  let target: HTMLElement;
  if (isString(opts.target)) {
    target = document.querySelector(opts.target) ?? document.body;
  } else {
    target = opts.target || document.body;
  }
  return {
    parent: target === document.body || opts.body ? document.body : target,
    background: opts.background ?? "rgba(0, 0, 0, 0.5)",
    spinner: opts.spinner,
    text: opts.text,
    fullscreen: target === document.body && (opts.fullscreen ?? true),
    lock: opts.lock ?? false,
    visible: opts.visible ?? true,
    target,
  };
}

function removeLoadingNumb(target: HTMLElement = document.body) {
  target.removeAttribute(LOADING_NUMB_KEY);
}

function getLoadingNumb(target: HTMLElement = document.body) {
  return target.getAttribute(LOADING_NUMB_KEY);
}

function updateLoadingNumb(
  target: HTMLElement = document.body,
  action: "add" | "sub"
) {
  const numb = parseInt(getLoadingNumb(target) || "0", 10);

  if (action === "add") {
    target.setAttribute(LOADING_NUMB_KEY, `${numb + 1}`);
  } else if (action === "sub" && numb > 0) {
    const newNumb = numb - 1;
    newNumb === 0
      ? removeLoadingNumb(target)
      : target.setAttribute(LOADING_NUMB_KEY, `${newNumb}`);
  }
}

function toggleClass(
  target: HTMLElement = document.body,
  className: string,
  action: "add" | "remove"
) {
  action === "add"
    ? target.classList.add(className)
    : target.classList.remove(className);
}

function addClass(
  options: LoadingOptions,
  parent: HTMLElement = document.body
) {
  options.lock
    ? toggleClass(parent, HIDDEN_CLASS, "add")
    : toggleClass(parent, HIDDEN_CLASS, "remove");

  toggleClass(parent, RELATIVE_CLASS, "add");
}

let fullscreenInstance: LoadingInstance | null = null;

export type LoadingInstance = ReturnType<typeof createLoading>;

export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options);
  const target = resolved.parent ?? document.body;

  if (resolved.fullscreen && !isNil(fullscreenInstance))
    return fullscreenInstance;

  updateLoadingNumb(target, "add");

  if (instanceMap.has(target)) return instanceMap.get(target)!;

  const instance = createLoading({
    ...resolved,
    closed: () => {
      resolved.closed?.();

      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
    },
  });

  addClass(options, target);
  target?.appendChild(instance.$el);

  nextTick(() => (instance.visible.value = !!resolved.visible));

  if (resolved.fullscreen) fullscreenInstance = instance;

  instanceMap.set(target, instance);
  return instance;
}
