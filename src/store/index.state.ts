import { listen } from "@tauri-apps/api/event";
import { ref } from "vue";

export const isBlur = ref(false);
export const isFocus = ref(false);
listen("tauri://focus", () => {
    isBlur.value = false;
    isFocus.value = true;
});
listen("tauri://blur", () => {
    isBlur.value = true;
    isFocus.value = false;
});

export * from "./gitmoji";
export * from "./repo";
export * from "./repoFileStatus";
export * from "./theme";
export * from "./repoLog";
export * from "./repoBranch";
export * from "./repoStatus";
export * from "./repoRemote";
