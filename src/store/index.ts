import { useRef } from "@/hooks";
import { ref } from "vue";

export const isBlur = ref(false);
export const isFocus = ref(false);
window.addEventListener("focus", () => {
    isBlur.value = false;
    isFocus.value = true;
});
window.addEventListener("blur", () => {
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
