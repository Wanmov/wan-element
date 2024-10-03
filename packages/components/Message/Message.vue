<template>
  <Transition
    :name="transitionName"
    @enter="boxHeight = messageRef!.getBoundingClientRect().height"
    @after-leave="!visible && onDestory()"
  >
    <div
      ref="messageRef"
      class="wan-message"
      :class="{
        [`wan-message--${type}`]: type,
        'is-close': showClose,
        'text-center': center,
      }"
      :style="customStyle"
      v-show="visible"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimmer"
    >
      <wan-icon class="wan-message__icon" :icon="iconName" />
      <div class="wan-message__content">
        <slot>
          <render-vnode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div class="wan-message__close" v-if="showClose">
        <wan-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { typeIconMap, RenderVnode, addUnit } from "@wan-element/utils";
import { bind, delay } from "lodash-es";
import type { MessageCompInstance, MessageProps } from "./types";
import { useEventListener, useOffset } from "@wan-element/hooks";
import { getLastBottomOffset } from "./method";
import WanIcon from "../Icon/Icon.vue";

defineOptions({ name: "WanMessage" });

const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();
const boxHeight = ref(0);

const { topOffset, bottomOffset } = useOffset({
  offset: props.offset,
  boxHeight,
  getLastBottomOffset: bind(getLastBottomOffset, props),
});

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");

const customStyle = computed(() => ({
  top: addUnit(topOffset.value),
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

watch(visible, (val) => {
  if (!val) boxHeight.value = -props.offset; // 使得退出的动画更加流畅
});

useEventListener(document, "keydown", (e: Event) => {
  const { code } = e as KeyboardEvent;
  if (code === "Escape") close();
});

onMounted(() => {
  visible.value = true;
  startTimmer();
});

defineExpose<MessageCompInstance>({
  close,
  bottomOffset,
});
</script>
<style scope>
@import "./style.css";
</style>
