import Collapse from "./Collapse.vue";
import CollapseItem from "./CollapseItem.vue";
import { withInstall } from "../../utils";

export const WanCollapse = withInstall(Collapse);
export const WanCollapseItem = withInstall(CollapseItem);

export * from "./types";
