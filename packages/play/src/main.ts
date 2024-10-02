import { createApp } from "vue";
import App from "./App.vue";
import WanElement, { zhCn } from "wan-element";
import "wan-element/dist/index.css";

createApp(App).use(WanElement, { locale: zhCn }).mount("#app");
