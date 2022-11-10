<script setup lang="ts">
import { onMounted } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import RepoList from "./components/RepoList/index.vue";
import RepoFiles from "./components/RepoFiles/index.vue";
import Header from "./components/Header.vue";
import Commit from "./components/Commit/index.vue";
import { tw } from "twind";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <div :class="tw`h-screen w-screen flex flex-col overflow-hidden`">
            <Header></Header>
            <div :class="tw`flex flex-1 overflow-hidden`">
                <RepoList></RepoList>
                <div :class="tw`flex flex-1 flex-col overflow-hidden`">
                    <Commit></Commit>
                    <RepoFiles></RepoFiles>
                </div>
            </div>
        </div>
    </ConfigProvider>
</template>
