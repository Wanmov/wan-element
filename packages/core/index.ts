import { makeInstaller } from "@wan-ui/utils";
import components from "./components";

const installer = makeInstaller(components);

export * from "@wan-ui/components";
export default installer;
