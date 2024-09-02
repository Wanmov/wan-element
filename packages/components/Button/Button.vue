<template>
  <component
    ref="_ref"
    class="wan-button"
    :is="tag"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : false"
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
import { computed, inject, ref } from "vue";
import type { ButtonProps, ButtonEmits, ButtonInstance } from "./types";
import { throttle } from "lodash-es";
import { BUTTON_GROUP_CTX_KEY } from "./constant";

import WanIcon from "../Icon/Icon.vue";

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
const ctx = inject(BUTTON_GROUP_CTX_KEY) || {};

const size = computed(() => ctx?.size ?? props?.size ?? "");
const type = computed(() => ctx?.type ?? props?.type ?? "");
const disabled = computed(() => ctx?.disabled || props?.disabled || false);

const iconStyle = computed(() => {
  marginRight: slots.default ? "6px" : "0px";
});

const handleClick = (e: MouseEvent) => emits("click", e);
const handleClickThrottle = throttle(handleClick, props.throttleDuration, {
  trailing: false,
});

defineExpose<ButtonInstance>({
  ref: _ref,
  disabled,
  size,
  type,
});
</script>
<style scope>
@import "./style.css";
</style>
