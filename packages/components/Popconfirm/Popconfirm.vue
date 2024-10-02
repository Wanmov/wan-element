<template>
  <wan-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
    <template #content>
      <div class="wan-popconfirm" :style="style">
        <div class="wan-popconfirm__main">
          <wan-icon v-if="!hideIcon && icon" :icon="icon" :color="iconColor" />
          {{ title }}
        </div>
        <div class="wan-popconfirm__action">
          <wan-button
            class="wan-popconfirm__cancel"
            size="small"
            :type="cancelButtonType"
            @click="cancel"
          >
            {{ cancelButtonText || locale.t("popconfirm.cancelButtonText") }}
          </wan-button>
          <wan-button
            class="wan-popconfirm__confirm"
            size="small"
            :type="confirmButtonType"
            @click="confrim"
          >
            {{ confirmButtonText || locale.t("popconfirm.confirmButtonText") }}
          </wan-button>
        </div>
      </div>
    </template>

    <template v-if="$slots.default" #default>
      <slot name="default"></slot>
    </template>

    <template v-if="$slots.reference" #default>
      <slot name="reference"></slot>
    </template>
  </wan-tooltip>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { addUnit } from "@wan-element/utils";
import WanTooltip from "../Tooltip/Tooltip.vue";
import WanButton from "../Button/Button.vue";
import WanIcon from "../Icon/Icon.vue";

import type { TooltipInstance } from "../Tooltip";
import type { PopconfirmProps, PopconfirmEmits } from "./types";
import { useLocale } from "@wan-element/hooks";

defineOptions({
  name: "WanPopconfirm",
});

const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: "",
  confirmButtonType: "primary",
  icon: "question-circle",
  iconColor: "#f90",
  hideAfter: 200,
  width: 150,
});

const emits = defineEmits<PopconfirmEmits>();
const tooltipRef = ref<TooltipInstance>();
const style = computed(() => ({ width: addUnit(props.width) }));

const locale = useLocale();

function hidePopper() {
  tooltipRef.value?.hide();
}

function confrim(e: MouseEvent) {
  emits("confirm", e);
  hidePopper();
}

function cancel(e: MouseEvent) {
  emits("cancel", e);
  hidePopper();
}
</script>

<style scoped>
@import "./style.css";
</style>
