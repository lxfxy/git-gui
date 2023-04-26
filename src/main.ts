import { createApp } from "vue";
import "./style.less";
import "./twind.setup";
// import "./utils";
import "./store";
import { VueQueryPlugin, VueQueryPluginOptions } from "@tanstack/vue-query";
import App from "./App.vue";

const app = createApp(App);
app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: true,
            },
        },
    },
} as VueQueryPluginOptions);
app.mount("#app");

const ws = new WebSocket("ws://127.0.0.1:6666");
ws.addEventListener("message", (e) => {
    console.log(e);
});
