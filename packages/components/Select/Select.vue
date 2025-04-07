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
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeydown"
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
        <div class="wan-select__loading" v-if="selectStates.loading">
          <wan-icon icon="spinner" spin />
        </div>
        <div class="wan-select__nodata" v-else-if="filterable && !hasData">
          No data
        </div>
        <ul class="wan-select__menu">
          <template v-if="!hasChildren">
            <wan-option
              v-for="item in filtedOptions"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <template v-else>
            <template
              v-for="[vNode, _props] in filtedChilds"
              :key="_props.value"
            >
              <render-vnode :vNode="vNode" />
            </template>
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
  h,
} from "vue";
import { POPPER_OPTIONS, SELECT_CTX_KEY } from "./constants";
import { useClickOutside, useFocusController, useId } from "@wan-element/hooks";
import {
  each,
  eq,
  filter,
  find,
  get,
  size,
  noop,
  isFunction,
  map,
  assign,
  isNil,
  isBoolean,
  includes,
  debounce,
} from "lodash-es";
import { debugWarn, RenderVnode } from "@wan-element/utils";
import useKeyMap from "./useKeyMap";

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
const filtedChilds = ref<Map<VNode, SelectOptionProps>>(new Map());
const filtedOptions = ref(props.options ?? []);

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
    const node = [...filtedChilds.value][selectStates.highlightedIndex]?.[0];
    result = filtedChilds.value.get(node);
  } else {
    result = filtedOptions.value[selectStates.highlightedIndex];
  }

  return result;
});

const childrenOptions = computed(() => {
  if (!hasChildren.value) return [];

  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled:
        item.props?.disabled === true ||
        (!isNil(item.props?.disabled) && !isBoolean(item.props?.disabled)),
    }),
  }));
});

const hasData = computed(
  () =>
    (hasChildren.value && filtedChilds.value.size > 0) ||
    (!hasChildren.value && size(filtedOptions.value) > 0)
);

const lastIndex = computed(() =>
  hasChildren.value
    ? filtedChilds.value.size - 1
    : size(filtedOptions.value) - 1
);

const filterPlaceholder = computed(() =>
  props.filterable && selectStates.selectedOption && isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder
);

const timeout = computed(() => (props.remote ? 300 : 100));

const handleFilterDebounce = debounce(handleFilter, timeout.value);

const inputId = useId().value;
const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleBlur,
  handleFocus,
} = useFocusController(inputRef);

const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex,
});

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
  props.filterable && controlInputVal(visible);
  isDropdownVisible.value = visible;
  emits("visible-change", visible);

  selectStates.highlightedIndex = -1;
}

// DropMenu 切换 InputValue 变化
function controlInputVal(visible: boolean) {
  if (!props.filterable) return;
  if (visible) {
    if (selectStates.selectedOption) selectStates.inputValue = "";
    handleFilterDebounce();
    return;
  }
  selectStates.inputValue = selectStates.selectedOption?.label || "";
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

function handleFilter() {
  const searcKey = selectStates.inputValue;
  selectStates.highlightedIndex = -1;

  if (hasChildren.value) {
    genFilterChilds(searcKey);
    return;
  }
  genFilterOptions(searcKey);
}

function handleKeydown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.(e);
}

function setFiltedChilds(opts: typeof childrenOptions.value) {
  filtedChilds.value.clear();
  each(opts, (item) => {
    filtedChilds.value.set(item.vNode, item.props as SelectOptionProps);
  });
}

async function genFilterChilds(search: string) {
  if (!props.filterable) return;

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    // remote search
    await callRemoteMethod(props.remoteMethod, search);
    setFiltedChilds(childrenOptions.value);
    return;
  }

  if (props.filterMethod && isFunction(props.filterMethod)) {
    // filter search
    const opts = map(props.filterMethod(search), "value");
    setFiltedChilds(
      filter(childrenOptions.value, (item) =>
        includes(opts, get(item, ["props", "value"]))
      )
    );
    return;
  }

  // default
  setFiltedChilds(
    filter(childrenOptions.value, (item) =>
      includes(get(item, ["props", "label"]), search)
    )
  );
}

async function genFilterOptions(search: string) {
  if (!props.filterable) return;

  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    // remote search
    filtedOptions.value = await callRemoteMethod(props.remoteMethod, search);
    return;
  }

  if (props.filterMethod && isFunction(props.filterMethod)) {
    // filter search
    filtedOptions.value = props.filterMethod(search);
    return;
  }

  // default
  filtedOptions.value = filter(props.options, (opt) =>
    includes(opt.label, search)
  );
}

async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return;

  selectStates.loading = true;
  let result;
  try {
    result = await method(search);
  } catch (error) {
    debugWarn(error as Error);
    debugWarn("WanSelect", "callRemoteMethod error");
    result = [];
    return Promise.reject(error);
  }

  return result;
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
  () => props.options,
  (newVal) => {
    filtedOptions.value = newVal ?? [];
  }
);

watch(
  () => childrenOptions.value,
  (newVal) => setFiltedChilds(newVal),
  { immediate: true }
);

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
