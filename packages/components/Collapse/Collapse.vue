<template>
  <div class="wan-collapse"><slot></slot></div>
</template>

<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import type {
  CollapseProps,
  CollapseItemEmits,
  CollapseItemName,
} from "./types";
import { COLLAPSE_CTX_KEY } from "./constans";

defineOptions({ name: "WanCollapse" });

const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseItemEmits>();
const activeNames = ref(props.modelValue);

if (props.accordion && activeNames.value.length > 1) {
  console.warn("accordion mode should only have one active item");
}

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
