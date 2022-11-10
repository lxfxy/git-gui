import { useOsTheme } from "naive-ui";
import { effect, ref, watch, watchEffect } from "vue";

export type ThemeType = "light" | "dark";
export const theme = ref<ThemeType>("light");
export const osTheme = useOsTheme();
effect(() => {
    theme.value = osTheme.value as ThemeType;
});
watch(
    () => theme.value,
    (newVal, oldVal) => {
        if (oldVal) {
            document.body.classList.remove(oldVal);
        }
        document.body.classList.add(newVal);
    },
    {
        immediate: true,
    }
);
