import { notification } from "./method";
import { rAF } from "@wan-element/utils";
import type { NotificationProps } from "./types";
import { useId } from "@wan-element/hooks";

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

describe("Notification", () => {
  const defaultProps: NotificationProps = {
    id: useId().value,
    zIndex: 2000,
    message: "hello notify",
    duration: 0,
    title: "Default Title",
    position: "top-right",
    onDestory: () => {},
  };
  test("notification() function", async () => {
    const handler = notification(defaultProps);
    await rAF();
    expect(document.querySelector(".wan-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".wan-notification")).toBeFalsy();
  });

  test("call notification() function more than once", async () => {
    notification(defaultProps);
    notification(defaultProps);
    await rAF();
    expect(document.querySelectorAll(".wan-notification").length).toBe(2);
    notification.closeAll();
    await rAF();
    expect(document.querySelectorAll(".wan-notification").length).toBe(0);
  });

  test("notification offset", async () => {
    notification({ ...defaultProps, offset: 100 });
    notification({ ...defaultProps, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".wan-notification");
    expect(elements.length).toBe(2);

    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
