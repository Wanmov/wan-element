<template>
  <div class="wan-collapse-item" :class="{ 'is-disabled': disabled }">
    <div
      class="wan-collapse-item__header"
      :class="{ 'is-active': isActive, 'is-disabled': disabled }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <span class="wan-collapse-item__title">
        <slot name="title">{{ title }}</slot></span
      >
      <wan-icon icon="angle-right" class="header-angle" />
    </div>
    <div class="wan-collapse-item__wapper" v-show="isActive">
      <div class="wan-collapse-item__content" :id="`item-content-${name}`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { CollapseItemProps } from "./types";
import { COLLAPSE_CTX_KEY } from "./constans";
import WanIcon from "../Icon/Icon.vue";

defineOptions({ name: "WanCollapse" });

const props = defineProps<CollapseItemProps>();
const ctx = inject(COLLAPSE_CTX_KEY, void 0);
const isActive = computed(() => ctx?.activeNames.value.includes(props.name));

function handleClick() {
  if (props.disabled) return;
  ctx?.handleItemClick(props.name);
}
</script>
<style scope></style>
