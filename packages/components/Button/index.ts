import Button from "./Button.vue";
import ButtonGroup from "./ButtonGroup.vue";
import { withInstall } from "@wan-element/utils";

export const WanButton = withInstall(Button);
export const WanButtonGroup = withInstall(ButtonGroup);

export * from "./types";
