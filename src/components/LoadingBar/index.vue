<script setup lang="ts">
import { NLoadingBarProvider } from "naive-ui";
import { loadingBarRenderEl } from "./";
</script>

<template>
    <NLoadingBarProvider
        :to="loadingBarRenderEl"
        :container-style="{ position: `absolute` }"
    >
        <slot></slot>
    </NLoadingBarProvider>
</template>
