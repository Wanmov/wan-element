<template>
  <div class="wan-button-group">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, toRef } from "vue";
import { BUTTON_GROUP_CTX_KEY } from "./constant";
import type { ButtonGroupProps } from "./types";

defineOptions({
  name: "WanButtonGroup",
});

const props = defineProps<ButtonGroupProps>();

provide(
  BUTTON_GROUP_CTX_KEY,
  reactive({
    size: toRef(props, "size"),
    type: toRef(props, "type"),
    disabled: toRef(props, "disabled"),
  })
);
</script>
<style scoped>
@import "./style.css"
</style>
