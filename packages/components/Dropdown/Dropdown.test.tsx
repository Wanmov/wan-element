import { withInstall } from "@wan-element/utils";
import { mount } from "@vue/test-utils";
import { WanDropdown, WanDropdownItem } from ".";
import type { DropdownItemProps } from "./types";

import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";

describe("Dropdown/index.ts", () => {
  it("should be exported with withInstall()", () => {
    expect(WanDropdown.install).toBeDefined();
    expect(WanDropdownItem.install).toBeDefined();
  });

  it("should be exported Dropdown component", () => {
    expect(WanDropdown).toBe(Dropdown);
    expect(WanDropdownItem).toBe(DropdownItem);
  });

  test("should enhance Dropdown component", () => {
    const enhancedDropdown = withInstall(Dropdown);
    expect(enhancedDropdown).toBe(WanDropdown);
  });

  test("should apply specific enhancements", () => {
    const enhancedDropdown = withInstall(Dropdown);
    expect(enhancedDropdown).toHaveProperty("install");
  });
});

describe("Dropdown.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it("should render slots correctly", () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1", command: 1 },
      { label: "Item 2", command: 2 },
    ];
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
      },
      slots: {
        default: () => <div>Default slot</div>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });

    expect(wrapper.text()).toContain("Default slot");
    expect(wrapper.find(".wan-dropdown").exists()).toBeTruthy();
  });

  it("should emit command event when item is clicked", async () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1", disabled: true },
      { label: "Item 2", command: "item2", divided: true },
    ];
    const onCommand = vi.fn();
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        onCommand,
      },
      slots: {
        default: () => <button id="trigger">Default slot content</button>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });

    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();

    triggerArea.trigger("click");
    await vi.runAllTimers();

    expect(wrapper.find(".wan-dropdown__menu").exists()).toBeTruthy();
    await wrapper.findAll("li").at(0)?.trigger("click");
    expect(onCommand).toBeCalledTimes(0); // disabled

    await wrapper.findAll("li").at(2)?.trigger("click");
    expect(onCommand).toBeCalled();
    expect(onCommand).toBeCalledWith("item2");
  });

  it("should toggle visibility when split btn is clicked", async () => {
    const items: DropdownItemProps[] = [
      { label: "Item 1" },
      { label: "Item 2", command: "item2" },
    ];
    const onClick = vi.fn();
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        splitButton: true,
        items,
        onClick,
      },
      slots: {
        default: () => <div id="trigger">Default slot content</div>,
      },
    });

    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();
    triggerArea.trigger("click");
    await vi.runAllTimers();

    expect(wrapper.find(".wan-dropdown__menu").exists()).toBeFalsy();
    expect(onClick).toBeCalled();
  });
});
