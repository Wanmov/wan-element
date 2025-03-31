<template>
  <div
    ref="selectRef"
    class="wan-select"
    :class="{
      'is-disabled': isDisabled,
    }"
    @click.stop="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <wan-tooltip
      ref="tooltipRef"
      placement="bottom-start"
      :popper-options="POPPER_OPTIONS"
      @click-outside="controlVisible(false)"
      manual
    >
      <template #default>
        <div ref="inputWrapperRef">
          <wan-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
          >
            <template #suffix>
              <wan-icon
                v-if="showClear"
                icon="circle-xmark"
                class="wan-input__clear"
                @click.stop="handleClear"
                @mousedown.prevent="noop"
              />
              <wan-icon
                v-else
                class="header-angle"
                icon="angle-down"
                :class="{ 'is-active': isDropdownVisible }"
              />
            </template>
          </wan-input>
        </div>
      </template>
      <template #content>
        <ul class="wan-select__menu">
          <template v-if="!hasChildren">
            <wan-option
              v-for="item in options"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </ul>
      </template>
    </wan-tooltip>
  </div>
</template>

<script setup lang="ts">
import type {
  SelectContext,
  SelectEmits,
  SelectInstance,
  SelectOptionProps,
  SelectProps,
  SelectStates,
} from "./types";
import type { TooltipInstance } from "../Tooltip/types";
import type { InputInstance } from "../Input/types";

import {
  ref,
  computed,
  reactive,
  provide,
  watch,
  nextTick,
  type VNode,
} from "vue";
import { POPPER_OPTIONS, SELECT_CTX_KEY } from "./constants";
import { useClickOutside, useFocusController, useId } from "@wan-element/hooks";
import { each, eq, filter, find, get, size, noop, isFunction } from "lodash-es";

import WanOption from "./Option.vue";
import WanTooltip from "../Tooltip/Tooltip.vue";
import WanInput from "../Input/Input.vue";
import WanIcon from "../Icon/Icon.vue";

defineOptions({ name: "WanSelect" });

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});
const emits = defineEmits<SelectEmits>();
const slots = defineSlots();

const selectRef = ref<HTMLElement>();
const tooltipRef = ref<TooltipInstance>();
const inputRef = ref<InputInstance>();

const isDropdownVisible = ref(false);

const initialOption = findOption(props.modelValue);

const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? "",
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightedIndex: -1,
});

const isDisabled = computed(() => props.disabled);
const children = computed(() =>
  filter(slots?.default?.(), (child) => eq(child.type, WanOption))
);
const hasChildren = computed(() => size(children.value) > 0);
const showClear = computed(
  () =>
    props.clearable && selectStates.mouseHover && selectStates.inputValue !== ""
);
const highlightedLine = computed(() => {
  let result: SelectOptionProps | void;
  if (hasChildren.value) {
    const node = children.value[selectStates.highlightedIndex];
    result = node.props.value;
  } else {
    result = props.options[selectStates.highlightedIndex];
  }

  return result;
});

const inputId = useId().value;
const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleBlur,
  handleFocus,
} = useFocusController(inputRef);

useClickOutside(selectRef, (e) => handleClickOutside(e));

const focus: SelectInstance["focus"] = function () {
  inputRef.value?.focus();
};

const blur: SelectInstance["blur"] = function () {
  handleClickOutside();
};

function handleClickOutside(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent("blur", e)));
  }
}

function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return;
  get(tooltipRef, ["value", visible ? "show" : "hide"])?.();
  isDropdownVisible.value = visible;
  emits("visible-change", visible);

  selectStates.highlightedIndex = -1;
}

function toggleVisible() {
  if (isDisabled.value) return;
  controlVisible(!isDropdownVisible.value);
}

function handleClear() {
  inputRef.value?.clear();
  selectStates.inputValue = "";
  selectStates.selectedOption = null;

  emits("clear");
  each(["change", "update:modelValue"], (k) => emits(k as any, ""));
}

function findOption(value: string) {
  return find(props.options, (opt) => opt.value === value);
}

function handleSelect(opt: SelectOptionProps) {
  if (opt.disabled) return;

  selectStates.inputValue = opt.label;
  selectStates.selectedOption = opt;
  each(["change", "update:modelValue"], (k) => emits(k as any, opt.value));
  controlVisible(false);
  inputRef.value?.focus();
}

function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt);
  }
  return opt.label;
}

function setSelected() {
  const opt = findOption(props.modelValue);
  if (!opt) return;
  selectStates.inputValue = opt.label;
  selectStates.selectedOption = opt;
}

watch(
  () => props.modelValue,
  () => {
    setSelected();
  }
);

provide<SelectContext>(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine,
});

defineExpose<SelectInstance>({
  focus,
  blur,
});
</script>
<style scoped>
@import "./style.css";
</style>
