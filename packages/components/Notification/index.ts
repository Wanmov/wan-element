import Notification from "./method";
import { withInstallFunction } from "@wan-element/utils";

export const WanNotification = withInstallFunction(Notification, "$notify");

export * from "./types";
