import { ref } from "vue";

export const loadingBarRenderEl = ref<HTMLElement>();
export const setLoadingBarRenderEl = (el: HTMLElement) => {
    loadingBarRenderEl.value = el;
};
