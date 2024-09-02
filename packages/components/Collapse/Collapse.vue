<template>
  <div class="wan-collapse"><slot></slot></div>
</template>

<script lang="ts" setup>
import { provide, ref, watch, watchEffect } from "vue";
import type {
  CollapseProps,
  CollapseItemEmits,
  CollapseItemName,
} from "./types";
import { COLLAPSE_CTX_KEY } from "./constans";
import { debugWarn } from "@wan-element/utils";

const COMP_NAME = "WanCollapse" as const;

defineOptions({ name: "WanCollapse" });

const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseItemEmits>();
const activeNames = ref(props.modelValue);

function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];

  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }

  const index = _activeNames.indexOf(item);
  if (index > -1) {
    _activeNames.splice(index, 1);
  } else {
    _activeNames.push(item);
  }
  updateActiveNames(_activeNames);
}

function updateActiveNames(newNames: CollapseItemName[]) {
  activeNames.value = newNames;
  emits("update:modelValue", newNames);
  emits("change", newNames);
}

watchEffect(() => {
  if (props.accordion && activeNames.value.length > 1) {
    debugWarn(COMP_NAME, "accordion mode should only have one active item");
  }
});

watch(
  () => props.modelValue,
  (newNames) => {
    updateActiveNames(newNames);
  }
);

provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>
<style scope>
@import "./style.css";
</style>
