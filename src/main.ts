import { createApp } from "vue";
import "./style.css";
import "./twind.setup";
import "./store/index";
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
