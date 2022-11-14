<script setup lang="ts">
import {
    darkTheme,
    GlobalTheme,
    lightTheme,
    NConfigProvider,
    NMessageProvider,
    zhCN,
    dateZhCN,
    NDialogProvider,
} from "naive-ui";
import { tw } from "twind";
import { theme, ThemeType } from "@/store/theme";
const themes: Record<ThemeType, GlobalTheme> = {
    dark: darkTheme,
    light: lightTheme,
};
</script>

<template>
    <NConfigProvider
        :class="[
            tw`h-screen w-screen bg-bgColor2 transition-color`,
            `scrollbar`,
        ]"
        :theme="themes[theme]"
        :locale="zhCN"
        :date-locale="dateZhCN"
    >
        <NMessageProvider :container-style="{ paddingTop: `80px` }">
            <NDialogProvider>
                <slot></slot>
            </NDialogProvider>
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
