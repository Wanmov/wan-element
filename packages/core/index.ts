import { makeInstaller } from "@wan-element/utils";
import components from "./components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@wan-element/theme/index.css";

library.add(fas);

const installer = makeInstaller(components);

export * from "@wan-element/components";
export default installer;
