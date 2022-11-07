<script setup lang="ts">
import { apply, tw } from "twind";
import { theme } from "@/store/theme";
</script>

<template>
    <span
        :class="
            tw`text-color1 cursor-pointer px-[16px] select-none center h-full hover:bg-bgColor2`
        "
        @click="theme = theme === 'dark' ? 'light' : 'dark'"
    >
        {{ theme === "dark" ? "浅色" : "深色" }}
    </span>
</template>
