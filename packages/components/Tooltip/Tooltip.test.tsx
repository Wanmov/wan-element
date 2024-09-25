import { withInstall } from "@wan-element/utils";
import { WanTooltip } from ".";
import Tooltip from "./Tooltip.vue";
import { mount } from "@vue/test-utils";

vi.mock("@popperjs/core");

const onVisibleChange = vi.fn();

describe("Tooltip/index.ts", () => {
  it("should be exported with withInstall", () => {
    expect(WanTooltip.install).toBeDefined();
  });
  it("should be exported Tooltip component", () => {
    expect(WanTooltip).toBe(Tooltip);
  });

  test("should enhance Tooltip component", () => {
    const enhanceTooltip = withInstall(Tooltip);
    expect(enhanceTooltip).toBe(WanTooltip);
  });

  test("should apply specific enhancements", () => {
    const enhanceTooltip = withInstall(Tooltip);
    expect(enhanceTooltip).toHaveProperty("install");
  });
});

describe("Tooltip.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  test("basic tooltip", async () => {
    const wrapper = mount(
      () => (
        <div>
          <div id="outside"></div>
          <Tooltip
            content="hello tooltip"
            trigger="click"
            {...{ onVisibleChange }}
          >
            <button id="trigger">trigger</button>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      }
    );
    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();

    // 弹出层是否出现
    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
    expect(wrapper.get(".wan-tooltip__popper").text()).toBe("hello tooltip");
    expect(onVisibleChange).toHaveBeenCalledWith(true);

    // 再次点击
    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenCalledTimes(2);

    // 等待动画
    await vi.runAllTimers();

    triggerArea.trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
    // 区域外点击关闭 tooltip
    wrapper.get("#outside").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
    expect(onVisibleChange).toHaveBeenCalledTimes(4);

    wrapper.unmount();
  });

  test("tooltip with hover trigger", async () => {
    const wrapper = mount(Tooltip, {
      props: { trigger: "hover", content: "test" },
    });
    wrapper.find(".wan-tooltip__trigger").trigger("mouseenter");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
    wrapper.find(".wan-tooltip").trigger("mouseleave");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
  });

  // 右键菜单触发的测试
  test("tooltip with contextmenu trigger", async () => {
    const wrapper = mount(Tooltip, {
      props: { trigger: "contextmenu", content: "test" },
    });
    // 测试右键菜单显示
    wrapper.find(".wan-tooltip__trigger").trigger("contextmenu");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
  });

  // 手动模式的测试
  test("tooltip with manual trigger", async () => {
    const wrapper = mount(Tooltip, {
      props: { manual: true, content: "test" },
    });
    // 测试手动触发显示和隐藏
    wrapper.vm.show();
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
    wrapper.vm.hide();
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();

    wrapper.setProps({ disabled: true });
    await vi.runAllTimers();
    wrapper.vm.show();
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
  });

  // 禁用状态的测试
  test("disabled tooltip", async () => {
    const wrapper = mount(Tooltip, {
      props: { disabled: true, content: "test" },
    });

    wrapper.find(".wan-tooltip__trigger").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
  });

  // 虚拟触发节点的测试
  test("tooltip with virtual trigger node", async () => {
    const virtualRef = document.createElement("div");
    let wrapper = mount(Tooltip, {
      props: { virtualTriggering: true },
    });
    wrapper.setProps({ virtualRef });
    await vi.runAllTimers();
    // 测试虚拟节点的事件触发
    virtualRef.dispatchEvent(new Event("mouseenter"));
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();

    wrapper.setProps({ trigger: "click" });
    await vi.runAllTimers();
    virtualRef.dispatchEvent(new Event("click"));
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();

    wrapper.unmount();
  });

  test("change trigger prop", async () => {
    const wrapper = mount(Tooltip, {
      props: { trigger: "hover", content: "test" },
    });

    wrapper.setProps({ trigger: "click" });

    await vi.runAllTimers();
    wrapper.find(".wan-tooltip__trigger").trigger("click");

    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();

    wrapper.find(".wan-tooltip__trigger").trigger("click");

    await vi.runAllTimers();

    wrapper.find(".wan-tooltip__trigger").trigger("hover");

    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();
  });

  test("change manual prop", async () => {
    const wrapper = mount(Tooltip, {
      props: { trigger: "hover", content: "test" },
    });

    wrapper.setProps({ manual: true });
    await vi.runAllTimers();

    wrapper.find(".wan-tooltip__trigger").trigger("hover");

    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();

    wrapper.setProps({ manual: false, trigger: "contextmenu" });

    await vi.runAllTimers();

    wrapper.find(".wan-tooltip__trigger").trigger("contextmenu");

    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();
  });

  test("click-outside disabled when trigger prop is hover or manual mode", async () => {
    const wrapper = mount(
      () => (
        <div>
          <div id="outside"></div>
          <Tooltip
            content="hello tooltip"
            trigger="hover"
            {...{ onVisibleChange }}
          >
            <button id="trigger">trigger</button>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      }
    );
    const triggerArea = wrapper.find("#trigger");
    expect(triggerArea.exists()).toBeTruthy();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeFalsy();

    // 弹出层是否出现
    wrapper.find(".wan-tooltip__trigger").trigger("mouseenter");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();

    // trigger:hover外层点击不触发
    wrapper.get("#outside").trigger("click");
    await vi.runAllTimers();
    expect(wrapper.find(".wan-tooltip__popper").exists()).toBeTruthy();

    wrapper.unmount();
  });
});