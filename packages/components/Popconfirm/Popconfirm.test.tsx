import { mount } from "@vue/test-utils";
import { each, get } from "lodash-es";
import { WanPopconfirm } from ".";
import { withInstall } from "@wan-element/utils";
import type { PopconfirmProps } from "./types";

import PopConfirm from "./Popconfirm.vue";

const onConfirm = vi.fn();
const onCancel = vi.fn();

describe("Popconfirm/index.ts", () => {
  it("should be exported with withInstall()", () => {
    expect(WanPopconfirm.install).toBeDefined();
  });

  it("should be exported Popconfirm component", () => {
    expect(WanPopconfirm).toBe(PopConfirm);
  });

  test("should enhance Popconfirm component", () => {
    const enhancedPopconfirm = withInstall(PopConfirm);
    expect(enhancedPopconfirm).toBe(WanPopconfirm);
  });

  test("should apply specific enhancements", () => {
    const enhancedPopconfirm = withInstall(PopConfirm);
    expect(enhancedPopconfirm).toHaveProperty("install");
  });
});

describe("Popconfirm.vue", () => {
  const props = {
    title: "Test Title",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonType: "primary",
    cancelButtonType: "info",
    icon: "check-circle",
    iconColor: "green",
    hideIcon: false,
    hideAfter: 500,
    width: 200,
  } as PopconfirmProps;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it("should accept all props", () => {
    const wrapper = mount(PopConfirm, {
      props,
    });

    each(props, (value, key) => {
      expect(get(wrapper.props(), key)).toBe(value);
    });
  });

  it("should render slot content correctly", () => {
    const slotContent = "Slot Content";
    const wrapper = mount(PopConfirm, {
      props,
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });

  test("popconfirm emits", async () => {
    const wrapper = mount(() => (
      <div>
        <div id="outside"></div>
        <PopConfirm
          title="Test Title"
          hideIcon={true}
          onConfirm={onConfirm}
          onCancel={onCancel}
        >
          <button id="trigger">trigger</button>
        </PopConfirm>
      </div>
    ));

    const triggerNode = wrapper.find("#trigger");
    expect(triggerNode.exists()).toBeTruthy();

    triggerNode.trigger("click");
    await vi.runAllTimers();

    expect(wrapper.find(".wan-popconfirm").exists()).toBeTruthy();
    const confirmBtn = wrapper.find(".wan-popconfirm__confirm");
    expect(confirmBtn.exists()).toBeTruthy();

    confirmBtn.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-popconfirm").exists()).toBeFalsy();
    expect(onConfirm).toBeCalled();

    triggerNode.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-popconfirm").exists()).toBeTruthy();

    const cancelBtn = wrapper.find(".wan-popconfirm__cancel");
    expect(cancelBtn.exists()).toBeTruthy();

    cancelBtn.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-popconfirm").exists()).toBeFalsy();
    expect(onCancel).toBeCalled();
  });
});