import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
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
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        // port: 8080,
    },
});
