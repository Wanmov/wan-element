<template>
  <div class="wan-tooltip" ref="containerNode" v-on="outerEvents">
    <div
      class="wan-tooltip__trigger"
      ref="_triggerNode"
      v-on="events"
      v-if="!virtualTriggering"
    >
      <slot></slot>
    </div>
    <slot name="default" v-else></slot>

    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div
        class="wan-tooltip__popper"
        ref="popperNode"
        v-on="dropdownEvents"
        v-if="visible"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch, watchEffect, type Ref } from "vue";
import type { TooltipEmits, TooltipInstance, TooltipProps } from "./types";
import { bind, debounce, isNil, type DebouncedFunc } from "lodash-es";
import { createPopper, type Instance } from "@popperjs/core";
import useClickoutside from "../../hooks/useClickOutside";
import useEvenstToTiggerNode from "./useEventsToTriggerNode";

interface _TooltipProps extends TooltipProps {
  virtualRef?: HTMLElement | void;
  virtualTriggering?: boolean;
}

defineOptions({
  name: "WanTooltip",
});

const props = withDefaults(defineProps<_TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  showTimeout: 0,
  hideTimeout: 200,
});

const emits = defineEmits<TooltipEmits>();
const visible = ref(false);

const events: Ref<Record<string, EventListener>> = ref({});
const outerEvents: Ref<Record<string, EventListener>> = ref({});
const dropdownEvents: Ref<Record<string, EventListener>> = ref({});

const containerNode = ref<HTMLElement>();
const popperNode = ref<HTMLElement>();
const _triggerNode = ref<HTMLElement>();

const triggerNode = computed(() => {
  if (props.virtualTriggering) {
    return (props.virtualRef as HTMLElement) ?? _triggerNode.value;
  }
  return _triggerNode.value as HTMLElement;
});

const popperOptions = computed(() => ({
  placement: props.placement,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 9],
      },
    },
  ],
  ...props.popperOptions,
}));

const openDelay = computed(() =>
  props.trigger === "hover" ? props.showTimeout : 0
);
const closeDelay = computed(() =>
  props.trigger === "hover" ? props.hideTimeout : 0
);

let openDebounce: DebouncedFunc<() => void> | void;
let closeDebounce: DebouncedFunc<() => void> | void;

function openFinal() {
  closeDebounce?.cancel();
  openDebounce?.();
}

function closeFinal() {
  openDebounce?.cancel();
  closeDebounce?.();
}

function togglePopper() {
  visible.value ? closeFinal() : openFinal();
}

function setVisible(val: boolean) {
  if (props.disabled) return;
  visible.value = val;
  emits("visible-change", val);
}

// Hover 事件处理逻辑
function handleHover() {
  events.value["mouseenter"] = openFinal;
  outerEvents.value["mouseleave"] = closeFinal;
  dropdownEvents.value["mouseenter"] = openFinal;
}

// Click 事件处理逻辑
function handleClick() {
  events.value["click"] = togglePopper;
}

// Contextmenu 事件处理逻辑
function handleContextMenu() {
  events.value["contextmenu"] = (e: Event) => {
    e.preventDefault();
    openFinal();
  };
}

function attachEvents() {
  if (props.disabled || props.manual) return;

  const triggerEventMap = {
    hover: handleHover,
    click: handleClick,
    contextmenu: handleContextMenu,
  };

  const handler = triggerEventMap[props.trigger];
  if (handler) handler();
}

let popperInstance: null | Instance;

function destroyPopperInstance() {
  if (isNil(popperInstance)) return;
  popperInstance.destroy();
  popperInstance = null;
}

function resetEvents() {
  events.value = {};
  outerEvents.value = {};
  dropdownEvents.value = {};

  attachEvents();
}

const show: TooltipInstance["show"] = openFinal;

const hide: TooltipInstance["hide"] = function () {
  openDebounce?.cancel();
  setVisible(false);
};

watch(
  visible,
  (val) => {
    if (!val) return;
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(
        triggerNode.value,
        popperNode.value,
        popperOptions.value
      );
    }
  },
  { flush: "post" }
);

// 手动模式监听
watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      resetEvents();
      return;
    }
    attachEvents();
  }
);

watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger === oldTrigger) return;
    visible.value = false;
    emits("visible-change", false);
    resetEvents();
  }
);

watchEffect(() => {
  // 自动绑定事件处理函数
  if (!props.manual) {
    attachEvents();
  }
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value);
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value);
});

useClickoutside(containerNode, () => {
  emits("click-outside");
  if (props.trigger === "hover" || props.manual) return;
  visible.value && closeFinal();
});

useEvenstToTiggerNode(props, triggerNode, events, () => {
  openDebounce?.cancel();
  setVisible(false);
});

onUnmounted(() => {
  destroyPopperInstance();
});

defineExpose<TooltipInstance>({
  show,
  hide,
});
</script>
<style scope>
@import "./style.css";
</style>
