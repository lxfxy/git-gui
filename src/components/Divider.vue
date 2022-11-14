<script setup lang="ts">
import { theme, ThemeType } from "@/store";
import {
    NDivider,
    GlobalThemeOverrides,
    DividerProps as NDividerProps,
} from "naive-ui";
import { computed, toRefs } from "vue";
interface DividerProps extends NDividerProps {
    dark?: GlobalThemeOverrides["Divider"];
    light?: GlobalThemeOverrides["Divider"];
}
const propsRaw = defineProps<DividerProps>();
const { dark, light, ...props } = toRefs(propsRaw);

const dividerTheme = computed<
    Record<ThemeType, GlobalThemeOverrides["Divider"]>
>(() => {
    return {
        dark: {
            ...dark?.value,
        },
        light: {
            color: "var(--text-color2)",
            ...light?.value,
        },
    };
});
</script>

<template>
    <NDivider
        v-bind="(props as ObjValuesUnRef<typeof props>)"
        :builtin-theme-overrides="dividerTheme[theme]"
    ></NDivider>
</template>
