import type { StoryObj, Meta } from "@storybook/vue3";

import { fn } from "@storybook/test";
import { WanTooltip } from "wan-element";
import "wan-element/dist/theme/Tooltip.css";

type Story = StoryObj<typeof WanTooltip>;

const meta: Meta<typeof WanTooltip> = {
  title: "Example/Tooltip",
  component: WanTooltip,
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      options: ["hover", "click", "contextmenu"],
      control: {
        type: "select",
      },
    },
    placement: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    "onVisible-change": fn(),
  },
};

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    placement: "top",
    trigger: "hover",
  },
  render: (args) => ({
    components: { WanTooltip },
    setup() {
      return {
        args,
      };
    },
    template: `
      <WanTooltip v-bind="args">
          <div style="height:30px;width:200px;background:red;padding:auto">trigger</div>
      </WanTooltip>
    `,
  }),
};

export default meta;
