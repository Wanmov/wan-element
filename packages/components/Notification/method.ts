import { h, isVNode, render, shallowReactive } from "vue";
import { useId, useZIndex } from "@wan-element/hooks";
import type {
  CreateNotificationProps,
  NotificationFn,
  NotificationHandler,
  NotificationInstance,
  NotificationParams,
  NotificationProps,
  NotificationType,
} from "./types";
import { each, findIndex, get, isString } from "lodash-es";
import NotificationConstructor from "./Notification.vue";

const instances: NotificationInstance[] = shallowReactive([]);
const { nextZIndex } = useZIndex();

export const notificationDefaults = {
  type: "info",
  duration: 3000,
  offset: 20,
  transitionName: "fade",
  showClose: true,
};

const normalizedOptions = (
  opts: NotificationParams
): CreateNotificationProps => {
  const result =
    !opts || isVNode(opts) || isString(opts) ? { message: opts } : opts;
  return { ...notificationDefaults, ...result } as CreateNotificationProps;
};

const createNotification = (
  props: CreateNotificationProps
): NotificationInstance => {
  const id = useId().value;
  const container = document.createElement("div");

  const destory = () => {
    const idx = findIndex(instances, { id });
    if (idx === -1) return;

    instances.splice(idx, 1);
    render(null, container);
  };

  const _props: NotificationProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory,
  };

  const vnode = h(NotificationConstructor, _props);
  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);

  const vm = vnode.component!;
  const handler: NotificationHandler = {
    close: () => vm.exposed!.close(),
  };
  const instance: NotificationInstance = {
    props: _props,
    id,
    vm,
    vnode,
    handler,
  };
  instances.push(instance);

  return instance;
};

export const notification: NotificationFn & Partial<Notification> = (
  options = {}
) => {
  const normalized = normalizedOptions(options);
  const instance = createNotification(normalized);

  return instance.handler;
};

export function closeAll(type?: NotificationType) {
  each(instances, (instance) => {
    if (type) {
      instance.props.type === type && instance.handler.close();
      return;
    }
    instance.handler.close();
  });
}

export function getLastBottomOffset(this: NotificationProps) {
  const idx = findIndex(instances, { id: this.id });
  if (idx <= 0) return 0;

  return get(instances, [idx - 1, "vm", "exposed", "bottomOffset", "value"]);
}

notification.closeAll = closeAll;

export default notification as Notification;
