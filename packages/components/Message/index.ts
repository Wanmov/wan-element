import Message from "./method";
import { withInstallFunction } from "@wan-element/utils";

export const WanMessage = withInstallFunction(Message, "$message");

export * from "./types";
