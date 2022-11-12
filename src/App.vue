<script setup lang="ts">
import { onMounted } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import RepoList from "./components/RepoList/index.vue";
import RepoFiles from "./components/RepoFiles/index.vue";
import Header from "./components/Header.vue";
import Commit from "./components/Commit/index.vue";
import Log from "./components/Log/index.vue";
import LoadingBar from "./components/LoadingBar/index.vue";
import Branch from "./components/Branch/index.vue";
import { tw } from "twind";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <LoadingBar>
            <div :class="tw`h-screen w-screen flex flex-col overflow-hidden`">
                <Header></Header>
                <div :class="tw`flex flex-1 overflow-hidden`">
                    <div :class="tw`w-[24%] flex flex-col`">
                        <RepoList></RepoList>
                        <Branch></Branch>
                        <Log></Log>
                    </div>
                    <div :class="tw`flex flex-1 flex-col overflow-hidden`">
                        <Commit></Commit>
                        <RepoFiles></RepoFiles>
                    </div>
                </div>
            </div>
        </LoadingBar>
    </ConfigProvider>
</template>
