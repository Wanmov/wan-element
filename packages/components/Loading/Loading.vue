<template>
  <transition name="fade-in-linear" @after-leave="onAfterLeave">
    <div
      v-show="(props.visible as Ref).value"
      class="wan-loading wan-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="wan-loading__spinner">
        <wan-icon v-if="props.spinner !== false" :icon="iconName" spin />
        <p v-if="text" class="wan-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { LoadingOptions } from "./types";
import { computed, type Ref } from "vue";
import { isString } from "lodash-es";
import WanIcon from "../Icon/Icon.vue";

defineOptions({
  name: "WanLoading",
  inheritAttrs: false,
});
const props = defineProps<LoadingOptions>();

const iconName = computed(() => {
  if (isString(props.spinner)) return props.spinner;

  return "spinner"; //circle-notch
});
</script>

<style>
@import "./style.css";

.wan-loading {
  --wan-loading-bg-color: v-bind(background) !important;
  --wan-loading-z-index: v-bind(zIndex) !important;
}
</style>
