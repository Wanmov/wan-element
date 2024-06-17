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
    ><slot></slot
  ></component>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { ButtonProps } from "./types";

defineOptions({
  name: "WanButton",
});
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
});

const slots = defineSlots();

const _ref = ref<HTMLButtonElement>();
</script>
<style scope>
@import "./style.css";
</style>
