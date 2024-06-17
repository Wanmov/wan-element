<template>
  <component
    :is="$props.tag"
    ref="_ref"
    class="wan-button"
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
    ><slot></slot
  ></component>
</template>

<script lang="ts" setup>
import { ref } from "vue";
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

const handleClick = (e: MouseEvent) => emits("click", e);
const handleClickThrottle = throttle(handleClick, props.throttleDuration);
</script>
<style scope>
@import "./style.css";
</style>
