<template>
  <Transition :name="transitionName" @after-leave="!visible && onDestory()">
    <div
      ref="messageRef"
      class="wan-message"
      :class="{
        [`wan-message--${type}`]: type,
        'is-close': showClose,
        'text-center': center,
      }"
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
import { computed, onMounted, ref } from "vue";
import { typeIconMap, RenderVnode } from "@wan-element/utils";
import { delay } from "lodash-es";
import type { MessageProps } from "./types";

defineOptions({ name: "WanMessage" });

const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();
const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");

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

defineExpose({
  close,
});
</script>
<style scope></style>
