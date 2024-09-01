<template>
  <i
    class="wan-icon"
    :class="{ [`wan-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { IconProps } from "./types.ts";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";

defineOptions({ name: "WanIcon", inheritAttrs: false });

const props = defineProps<IconProps>();
const filterProps = computed(() => omit(props, ["type", "color"]));
const customStyles = computed(() => ({ color: props.color ?? void 0 }));
</script>
<style scoped>
@import "./style.css";
</style>
