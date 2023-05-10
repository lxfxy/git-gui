import { VueQueryPlugin, VueQueryPluginOptions } from "@tanstack/vue-query";
import { createApp } from "vue";
import App from "./App.vue";
import "./store";
import "./style.less";
import "./twind.setup";

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
