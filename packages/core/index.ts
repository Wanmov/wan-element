import { makeInstaller } from "@wan-element/utils";
import components from "./components";
import '@wan-element/theme/index.css'

const installer = makeInstaller(components);

export * from "@wan-element/components";
export default installer;
