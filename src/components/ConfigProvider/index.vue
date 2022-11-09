<script setup lang="ts">
import {
    darkTheme,
    GlobalThemeOverrides,
    lightTheme,
    NConfigProvider,
    NMessageProvider,
    zhCN,
} from "naive-ui";
import { tw } from "twind";
import { theme, ThemeType } from "@/store/theme";
const themes: Record<ThemeType, GlobalThemeOverrides> = {
    dark: darkTheme as any,
    light: lightTheme as any,
};
</script>

<template>
    <NConfigProvider
        :class="[
            tw`h-screen w-screen bg-bgColor2 transition-color`,
            theme,
            `scrollbar`,
        ]"
        :theme-overrides="themes[theme]"
        :locale="zhCN"
    >
        <NMessageProvider>
            <slot></slot>
        </NMessageProvider>
    </NConfigProvider>
</template>

<style lang="less">
@import "./themes/dark.css";
@import "./themes/light.css";

.scrollbar {
    * ::-webkit-scrollbar {
        background-color: var(--scroll-color);
        width: 8px;
    }
    * ::-webkit-scrollbar-thumb {
        background-color: var(--scroll-thumb-color);
    }
}
</style>
