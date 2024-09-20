import { withInstall } from "@wan-element/utils";

describe("Tooltip/index.ts", () => {
  it("should be exported with withInstall", () => {
    expect(WanTooltip.install).toBeDefined();
  });
  it("should be exported Tooltip component", () => {
    expect(WanTooltip).toBe(ToolTip);
  });

  test("should enhance Tooltip component", () => {
    const enhanceTooltip = withInstall(ToolTip);
    expect(enhanceTooltip).toBe(WanTooltip);
  });

  test("should apply specific enhancements", () => {
    const enhanceTooltip = withInstall(ToolTip);
    expect(enhanceTooltip).toHaveProperty("install");
  });
});
