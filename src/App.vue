<script setup lang="ts">
import { onMounted } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import Header from "./components/Header.vue";
import LoadingBar from "./components/LoadingBar/index.vue";
import Initial from "./components/Initial.vue";

import RepoList from "./feature-modules/RepoList/index.vue";
import RepoFiles from "./feature-modules/RepoFiles/index.vue";
import Commit from "./feature-modules/Commit/index.vue";
import Log from "./feature-modules/Log/index.vue";
import Branch from "./feature-modules/Branch/index.vue";
import { tw } from "twind";
import { NDialogProvider } from "naive-ui";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
</script>

<template>
    <ConfigProvider>
        <LoadingBar>
            <Initial />
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
