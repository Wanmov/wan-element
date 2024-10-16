import { Loading } from "./service";
import { vLoading } from "./directive";
import type { App } from "vue";

export const WanLoading = {
  name: "WanLoading",
  install(app: App) {
    app.directive("loading", vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  service: Loading,
  directive: vLoading,
};

export default WanLoading;

export {
  vLoading,
  vLoading as WanLoadingDirective,
  Loading as WanLoadingService,
};

export * from "./types";
