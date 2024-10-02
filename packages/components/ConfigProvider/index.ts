import ConfigProvider from "./ConfigProvider.vue";
import { withInstall } from "@wan-element/utils";

export const WanConfigProvider = withInstall(ConfigProvider);

export * from "./types";
export * from "./hooks";
