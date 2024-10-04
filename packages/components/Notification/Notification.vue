<template>
  <transition
    :name="`wan-notification-${transitionName}`"
    @after-leave="!visible && onDestory()"
    @enter="boxHeight = notifyRef!.getBoundingClientRect().height"
  >
    <div
      ref="notifyRef"
      class="wan-notification"
      :class="{
        [`wan-notification--${type}`]: type,
        [horizontalClass]: true,
        'show-close': showClose,
      }"
      :style="customStyle"
      v-show="visible"
      role="alert"
      @click="onClick"
      @mouseenter="clearTimer"
      @mouseleave="startTimmer"
    >
      <wan-icon
        v-if="iconName"
        :icon="iconName"
        class="wan-notification__icon"
      />

      <div class="wan-notification__text">
        <div class="wan-notification__title">{{ title }}</div>
        <div class="wan-notification__content">
          <slot>
            <render-vnode v-if="message" :vNode="message" />
          </slot>
        </div>
      </div>
      <div class="wan-notification__close" v-if="showClose">
        <wan-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { NotificationCompInstance, NotificationProps } from "./types";
import { useOffset } from "@wan-element/hooks";
import { getLastBottomOffset } from "./method";
import { bind, delay } from "lodash-es";
import { addUnit, typeIconMap } from "@wan-element/utils";

defineOptions({ name: "WanNotification" });

const props = withDefaults(defineProps<NotificationProps>(), {
  type: "info",
  duration: 3000,
  offset: 20,
  position: "top-right",
  transitionName: "fade",
  showClose: true,
});

const visible = ref(false);
const notifyRef = ref<HTMLDivElement>();
// div 高度
const boxHeight = ref(0);

const { topOffset, bottomOffset } = useOffset({
  getLastBottomOffset: bind(getLastBottomOffset, props),
  offset: props.offset,
  boxHeight,
});

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");

const horizontalClass = computed(() =>
  props.position.endsWith("right") ? "right" : "left"
);

const verticalProperty = computed(() =>
  props.position.startsWith("top") ? "top" : "bottom"
);

const customStyle = computed(() => ({
  [verticalProperty.value]: addUnit(topOffset.value),
  zIndex: props.zIndex,
}));

let timer: number;
function startTimmer() {
  if (props.duration === 0) return;
  timer = delay(close, props.duration);
}

function clearTimer() {
  clearTimeout(timer);
}

function close() {
  visible.value = false;
}

onMounted(() => {
  visible.value = true;
  startTimmer();
});

defineExpose<NotificationCompInstance>({
  bottomOffset,
  close,
});
</script>

<style>
@import "./style.css";
</style>
