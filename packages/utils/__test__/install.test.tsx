import { createApp, defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { makeInstaller, withInstall } from "../install";

const AppComp = defineComponent({
  setup() {
    return () => <div>App</div>;
  },
});

const compA = withInstall(
  defineComponent({
    name: "CompA",
    setup() {
      return () => <div>test1</div>;
    },
  })
);

const compB = withInstall(
  defineComponent({
    name: "CompB",
    setup() {
      return () => <div>test2</div>;
    },
  })
);

describe("install", () => {
  it("withInstall should be worked", () => {
    const wapper = mount(() => <div id="app"></div>);
    const app = createApp(AppComp);

    app.use(compA).mount(wapper.element);

    expect(compA.install).toBeDefined();
    expect(compB.install).toBeDefined();
    expect(app._context.components['CompA']).toBeTruthy();
    expect(app._context.components['CompB']).toBeFalsy();
  });
  it("makeInstaller should be worked", () => {
    const wapper = mount(() => <div id="app"></div>);
    const app = createApp(AppComp);
    const installer = makeInstaller([compA, compB]);

    app.use(installer).mount(wapper.element);

    expect(installer).toBeDefined();
    expect(app._context.components['CompA']).toBeTruthy();
    expect(app._context.components['CompB']).toBeTruthy();
  });
});
