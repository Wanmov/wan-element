import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import { withInstall } from "@wan-element/utils";

export const WanDropdown = withInstall(Dropdown);
export const WanDropdownItem = withInstall(DropdownItem);

export * from "./types";
