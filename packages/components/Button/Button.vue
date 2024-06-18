<template>
  <component
    ref="_ref"
    class="wan-button"
    :is="tag"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`wan-button--${type}`]: type,
      [`wan-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    @click="
      (e: MouseEvent) => (useThrottle ? handleClickThrottle(e) : handleClick(e))
    "
  >
    <template v-if="loading">
      <slot name="loading">
        <wan-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          :style="iconStyle"
          spin
        ></wan-icon>
      </slot>
    </template>
    <wan-icon
      v-if="icon && !loading"
      :icon="icon"
      :style="iconStyle"
      size="1x"
    ></wan-icon>
    <slot></slot
  ></component>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { ButtonProps, ButtonEmits, ButtonInstance } from "./types";
import { throttle } from "lodash-es";

defineOptions({
  name: "WanButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: true,
  throttleDuration: 500,
});

const emits = defineEmits<ButtonEmits>();

const slots = defineSlots();

const _ref = ref<HTMLButtonElement>();

const iconStyle = computed(() => {
  mariginRight: slots.default ? "6px" : "0px";
});

const handleClick = (e: MouseEvent) => emits("click", e);
const handleClickThrottle = throttle(handleClick, props.throttleDuration);
</script>
<style scope>
@import "./style.css";
</style>
