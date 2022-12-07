import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({ customElement: /^Button$/ }),
        vueJsx(),
        // AutoImport({
        //     imports: [
        //         "vue",
        //         {
        //             "naive-ui": [
        //                 "useDialog",
        //                 "useMessage",
        //                 "useNotification",
        //                 "useLoadingBar",
        //             ],
        //         },
        //     ],
        // }),
        // Components({
        //     resolvers: [NaiveUiResolver()],
        // }),
    ],
    server: {
        port: 1420,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
