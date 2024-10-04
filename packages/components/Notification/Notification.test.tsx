import { describe, test, expect } from "vitest";
import { notification } from "./method";
import { nextTick } from "vue";

function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}

const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null);
        await nextTick();
      });
    });
  });
};

describe("Notification", () => {
  test("notification() function", async () => {
    const handler = notification({ message: "hello notify", duration: 0 });
    await rAF();
    expect(document.querySelector(".wan-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".wan-notification")).toBeFalsy();
  });

  test("call notification() function more than once", async () => {
    notification({ message: "hello notify", duration: 0 });
    notification({ message: "hello notify", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".wan-notification").length).toBe(2);
    notification.closeAll();
    await rAF();
    expect(document.querySelectorAll(".wan-notification").length).toBe(0);
  });

  test("notification offset", async () => {
    notification({ message: "hello msg", duration: 0, offset: 100 });
    notification({ message: "hello msg", duration: 0, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".wan-notification");
    expect(elements.length).toBe(2);

    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});
