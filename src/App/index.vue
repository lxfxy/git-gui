<script setup lang="ts">
import { NButton } from "naive-ui";
import { onMounted } from "vue";
import ConfigProvider from "./ConfigProvider.vue";
import Header from "./Header.vue";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <Header></Header>
    </ConfigProvider>
</template>
