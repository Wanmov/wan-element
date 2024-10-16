import { config, mount } from "@vue/test-utils";
import { each, get } from "lodash-es";
import { WanPopconfirm } from ".";
import { withInstall } from "@wan-element/utils";
import type { PopconfirmProps } from "./types";

import PopConfirm from "./Popconfirm.vue";
import { BUTTON_GROUP_CTX_KEY } from "../Button/constant";
import { i18nSymbol } from "vue3-i18n";

const onConfirm = vi.fn();
const onCancel = vi.fn();

const mockI18n = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      "popconfirm.cancelButtonText": "取消",
      "popconfirm.confirmButtonText": "确认",
    };
    return translations[key] || key; // 返回对应翻译或原键
  },
};

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

    Reflect.set(config.global.provide, i18nSymbol, mockI18n);
  });

  afterEach(() => {
    config.global.provide = {};
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
    const wrapper = mount(
      () => (
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
      ),
      {
        global: {
          provide: {
            [BUTTON_GROUP_CTX_KEY as symbol]: {
              size: "small",
              type: "primary",
            },
          },
        },
      }
    );

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
