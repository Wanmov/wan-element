import Select from "./Select.vue";
import Option from "./Option.vue";

import { withInstall } from "@wan-element/utils";

export const WanSelect = withInstall(Select);
export const WanOption = withInstall(Option);

export * from "./types";
