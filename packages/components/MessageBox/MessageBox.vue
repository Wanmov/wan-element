<template>
  <transition name="fade-in-linear" @after-leave="destroy">
    <wan-overlay v-show="(visible as Ref).value" :z-index="state.zIndex" mask>
      <div
        role="dialog"
        class="wan-overlay-message-box"
        @click="handleWrapperClick"
      >
        <div
          ref="rootRef"
          :class="[
            'wan-message-box',
            {
              'is-center': state.center,
            },
          ]"
          @click.stop
        >
          <div
            v-if="!isNil(state.title)"
            ref="headerRef"
            class="wan-message-box__header"
            :class="{ 'show-close': state.showClose }"
          >
            <div class="wan-message-box__title">
              <wan-icon
                v-if="iconComponent && state.center"
                :class="{
                  [`wan-icon-${state.type}`]: state.type,
                }"
                :icon="iconComponent"
              />
              {{ state.title }}
            </div>
            <button
              v-if="showClose"
              class="wan-message-box__header-btn"
              @click.stop="handleClose"
            >
              <wan-icon icon="xmark" />
            </button>
          </div>
          <div class="wan-message-box__content">
            <wan-icon
              v-if="iconComponent && !state.center && hasMessage"
              :class="{
                [`wan-icon-${state.type}`]: state.type,
              }"
              :icon="iconComponent"
            />
            <div v-if="hasMessage" class="wan-message-box__message">
              <slot>
                <component
                  :is="state.showInput ? 'label' : 'p'"
                  :for="state.showInput ? inputId : undefined"
                >
                  {{ state.message }}
                </component>
              </slot>
            </div>
          </div>
          <div v-show="state.showInput" class="wan-message-box__input">
            <wan-input
              v-model="state.inputValue"
              ref="inputRef"
              :placeholder="state.inputPlaceholder"
              :type="state.inputType"
              @keyup.enter="handleInputEnter"
            />
          </div>
          <div class="wan-message-box__footer">
            <wan-button
              v-if="state.showCancelButton"
              class="wan-message-box__footer-btn wan-message-box__cancel-btn"
              :type="state.cancelButtonType"
              :round="state.roundButton"
              :loading="state.cancelButtonLoading"
              @click="handleAction('cancel')"
              @keydown.prevent.enter="handleAction('cancel')"
              >{{ state.cancelButtonText }}</wan-button
            >
            <wan-button
              v-show="state.showConfirmButton"
              class="wan-message-box__footer-btn wan-message-box__confirm-btn"
              :type="state.confirmButtonType ?? 'primary'"
              :round="state.roundButton"
              :loading="state.confirmButtonLoading"
              @click="handleAction('confirm')"
              @keydown.prevent.enter="handleAction('confirm')"
              >{{ state.confirmButtonText }}</wan-button
            >
          </div>
        </div>
      </div>
    </wan-overlay>
  </transition>
</template>

<script setup lang="ts">
import type { MessageBoxProps, MessageBoxAction } from "./types";
import type { InputInstance } from "../Input/types";
import { useZIndex, useId } from "@wan-element/hooks";
import { typeIconMap } from "@wan-element/utils";
import { reactive, computed, ref, watch, nextTick, type Ref } from "vue";

import WanOverlay from "../Overlay/Overlay.vue";
import WanIcon from "../Icon/Icon.vue";
import WanButton from "../Button/Button.vue";
import WanInput from "../Input/Input.vue";
import { isFunction, isNil } from "lodash-es";

defineOptions({
  name: "WanMessageBox",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<MessageBoxProps>(), {
  lockScroll: true,
  showClose: true,
  closeOnClickModal: true,
  confirmButtonType: "primary",
  roundButton: false,
  boxType: "",
  inputValue: "",
  inputPlaceholder: "Please input...",
  confirmButtonText: "Ok",
  cancelButtonText: "Cancel",
  showConfirmButton: true,
});

const { doAction } = props;
const { nextZIndex } = useZIndex();

const headerRef = ref<HTMLElement>();
const inputRef = ref<InputInstance>();
const inputId = useId();

const state = reactive({
  ...props,
  zIndex: nextZIndex(),
});

const hasMessage = computed(() => !!state.message);
const iconComponent = computed(
  () => state.icon ?? typeIconMap.get(state.type ?? "")
);

watch(
  () => props.visible?.value,
  (val) => {
    if (val) state.zIndex = nextZIndex();
    if (props.boxType !== "prompt") return;

    if (!val) return;

    nextTick(() => {
      inputRef.value && inputRef.value.focus();
    });
  }
);

function handleWrapperClick() {
  props.closeOnClickModal && handleAction("close");
}

function handleInputEnter(e: KeyboardEvent) {
  if (state.inputType === "textarea") return;
  e.preventDefault();
  return handleAction("confirm");
}

function handleAction(action: MessageBoxAction) {
  isFunction(props.beforeClose)
    ? props.beforeClose(action, state, () => doAction(action, state.inputValue))
    : doAction(action, state.inputValue);
}

function handleClose() {
  handleAction("close");
}
</script>

<style>
@import "./style.css";
</style>
