<script setup lang="ts">
import {
    darkTheme,
    GlobalThemeOverrides,
    lightTheme,
    NConfigProvider,
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
        :class="[tw`h-screen w-screen bg-bgColor2 transition-color`, theme]"
        :theme-overrides="themes[theme]"
    >
        <slot></slot>
    </NConfigProvider>
</template>

<style>
@import "./themes/dark.css";
@import "./themes/light.css";
</style>
