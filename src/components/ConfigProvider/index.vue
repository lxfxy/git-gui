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
    NNotificationProvider,
} from "naive-ui";
import { apply, tw } from "twind";
import { theme, ThemeType } from "@/store/theme";
import { css } from "twind/css";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("js", javascript);
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
        :hljs="hljs"
    >
        <NMessageProvider>
            <NDialogProvider>
                <NNotificationProvider
                    placement="bottom-right"
                    :container-style="{ maxHeight: '80vh' }"
                >
                    <slot></slot>
                </NNotificationProvider>
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
