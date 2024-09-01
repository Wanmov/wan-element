import { makeInstaller } from "@wan-element/utils";
import components from "./components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import printLogo from "./printLogo";
import "@wan-element/theme/index.css";

printLogo();

library.add(fas);

const installer = makeInstaller(components);

export * from "@wan-element/components";
export default installer;
