import { useOsTheme } from "naive-ui";
import { effect, ref } from "vue";

export type ThemeType = "light" | "dark";
export const theme = ref<ThemeType>("light");
export const osTheme = useOsTheme();
effect(() => {
    theme.value = osTheme.value as ThemeType;
});
