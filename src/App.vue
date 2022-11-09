<script setup lang="ts">
import { onMounted } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import RepoList from "./components/RepoList/index.vue";
import RepoFiles from "./components/RepoFiles/index.vue";
import Header from "./components/Header.vue";
import { NLayout, NLayoutContent, NLayoutSider } from "naive-ui";
import { tw } from "twind";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <div :class="tw`h-screen w-screen flex flex-col`">
            <Header></Header>
            <div :class="tw`flex flex-1`">
                <RepoList></RepoList>
                <RepoFiles></RepoFiles>
            </div>
        </div>
    </ConfigProvider>
</template>
