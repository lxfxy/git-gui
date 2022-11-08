<script setup lang="ts">
import { NButton } from "naive-ui";
import { onMounted } from "vue";
import ConfigProvider from "./ConfigProvider.vue";
import Header from "./Header.vue";
import { repos, getLocalRepo } from "@/store/repo";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <Header></Header>
        <NButton @click="getLocalRepo">选择仓库</NButton>
        {{ repos }}
    </ConfigProvider>
</template>
