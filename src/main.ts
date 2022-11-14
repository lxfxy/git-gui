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
