<script setup lang="ts">
import { contextmenuRepo, setCurRepo } from "@/store";
import { commandErrorDialog, runCommand } from "@/utils";
import { message } from "@/utils/globalApis";
import { writeText } from "@tauri-apps/api/clipboard";
import { open } from "@tauri-apps/api/shell";
import { tw } from "twind";
import Button from "../Branch/Button";
const vscodeOpen = async () => {
    const command = runCommand("code", [contextmenuRepo.value!.dir]);
    await command.exec().catch(commandErrorDialog);
};
const openDir = async () => {
    await open(contextmenuRepo.value!.dir);
    // const command = runCommand("start", [contextmenuRepo.value!.dir]);
    // const data = await command.exec().catch(commandErrorDialog);
};
const copyRepoName = async () => {
    await writeText(contextmenuRepo.value!.title);
    message.value?.success("复制仓库名成功");
};
const copyRepoDir = async () => {
    await writeText(contextmenuRepo.value!.dir);
    message.value?.success("复制仓库目录路径成功");
};
</script>

<template>
    <div :class="tw`flex flex-col w-[200px]`">
        <Button @click="setCurRepo(contextmenuRepo!)">切换至此仓库</Button>
        <Button @click="vscodeOpen">
            通过&nbsp;<code>vscode</code>&nbsp;打开此目录
        </Button>
        <Button @click="openDir"> 通过资源管理器打开此目录 </Button>
        <Button @click="copyRepoName"> 复制仓库名 </Button>
        <Button @click="copyRepoDir"> 复制仓库目录路径 </Button>
    </div>
</template>
