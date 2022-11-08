<script setup lang="ts">
import { onMounted } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import RepoList from "./components/RepoList/index.vue";
import Header from "./components/Header.vue";
import { repos, getLocalRepo } from "@/store/repo";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <Header></Header>
        <RepoList></RepoList>
    </ConfigProvider>
</template>
