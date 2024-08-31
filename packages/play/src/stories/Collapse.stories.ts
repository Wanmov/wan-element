import type { Meta, StoryObj } from "@storybook/vue3";
import { WanCollapse, WanCollapseItem } from "wan-element";

type Story = StoryObj<typeof WanCollapse>;

const meta: Meta<typeof WanCollapse> = {
  title: "Example/Collapse",
  component: WanCollapse,
  subcomponents: { WanCollapseItem },
  tags: ["autodocs"],
};

export const Default: Story = {
  render: (args) => ({
    components: {
      WanCollapse,
      WanCollapseItem,
    },
    setup() {
      return {
        args,
      };
    },
    template: `
    <wan-collapse v-bind="args">
      <wan-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </wan-collapse-item>
      <wan-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </wan-collapse-item>
      <wan-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </wan-collapse-item>
    </wan-collapse>
    `,
  }),
  args: {
    accordion: true,
    modelValue: ["a"],
  },
};

export default meta;
