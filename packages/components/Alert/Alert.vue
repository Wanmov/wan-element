<template>
  <transition name="wan-alert-fade">
    <div
      v-show="visible"
      class="wan-alert"
      role="alert"
      :class="{
        [`wan-alert__${type}`]: type,
        [`wan-alert__${effect}`]: effect,
        'text-center': center,
      }"
    >
      <wan-icon
        v-if="showIcon"
        class="wan-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <div class="wan-alert__content">
        <span
          class="wan-alert__title"
          :class="{ 'with-desc': withDescription }"
          :style="{ display: center && !showIcon ? 'flow' : 'inline' }"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="wan-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="wan-alert__close" v-if="closable">
          <wan-icon @click.stop="close" icon="xmark" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { AlertEmits, AlertInstance, AlertProps } from "./types";
import { typeIconMap } from "@wan-element/utils";

import WanIcon from "../Icon/Icon.vue";

defineOptions({ name: "WanAlert" });

const props = withDefaults(defineProps<AlertProps>(), {
  effect: "light",
  type: "info",
  closable: true,
});
const emits = defineEmits<AlertEmits>();
const slots = defineSlots();

const visible = ref(true);

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");
const withDescription = computed(() => props.description || slots.default);

function close() {
  visible.value = false;
  emits("close");
}

function open() {
  visible.value = true;
}

defineExpose<AlertInstance>({
  open,
  close,
});
</script>
<style scope>
@import "./style.css";
</style>
