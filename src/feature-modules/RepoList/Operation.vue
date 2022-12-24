<script setup lang="ts">
import {
    contextmenuRepo,
    curRepo,
    delLocalRepo,
    repoGroups,
    setCurRepo,
    contextmenuScheduler,
    delRepoGroupRepo,
    addRepoGroupRepo,
} from "@/store";
import {
    commandErrorDialog,
    filterArrayItems,
    jsxClickStop,
    runCommand,
} from "@/utils";
import { message } from "@/utils/globalApis";
import { writeText } from "@tauri-apps/api/clipboard";
import { open } from "@tauri-apps/api/shell";
import { NPopconfirm, NPopover, NSelect } from "naive-ui";
import { tw } from "twind";
import { computed, watch } from "vue";
import Button from "../Branch/Button";
const { close } = contextmenuScheduler;
const vscodeOpen = async () => {
    const command = runCommand("code", [contextmenuRepo.value!.dir]);
    await command.exec().catch(commandErrorDialog);
    close();
};
const openDir = async () => {
    await open(contextmenuRepo.value!.dir);
    // const command = runCommand("start", [contextmenuRepo.value!.dir]);
    // const data = await command.exec().catch(commandErrorDialog);
    close();
};
const copyRepoName = async () => {
    await writeText(contextmenuRepo.value!.title);
    message.value?.success("复制仓库名成功");
    close();
};
const copyRepoDir = async () => {
    await writeText(contextmenuRepo.value!.dir);
    message.value?.success("复制仓库目录路径成功");
    close();
};
const contextmenuRepoIsCurrent = computed(() => {
    return contextmenuRepo.value! === curRepo.value!;
});

watch(
    () => contextmenuRepo.value?.group,
    (newGroups, oldGroups) => {
        if (!contextmenuRepo.value) {
            return;
        }
        const delGroups =
            filterArrayItems(oldGroups || [], ...(newGroups || [])) || [];
        const dir = contextmenuRepo.value!.dir;
        repoGroups.value?.forEach((group) => {
            if (delGroups.includes(group.name)) {
                delRepoGroupRepo(group.name, [dir]);
            }
            if (newGroups?.includes(group.name)) {
                addRepoGroupRepo(group.name, [dir]);
            }
        });
    }
);
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
        <NPopconfirm
            :show-icon="false"
            placement="right"
            :width="300"
            @negative-click="close"
            @positive-click="close"
        >
            <template #trigger>
                <Button @click.stop>选择分组</Button>
            </template>
            <NSelect
                :options="repoGroups"
                value-field="name"
                label-field="name"
                :input-props="{
                    onClick: jsxClickStop,
                }"
                filterable
                multiple
                v-model:value="contextmenuRepo!.group"
            >
            </NSelect>
        </NPopconfirm>
        <Button.Danger
            @click="
                delLocalRepo([contextmenuRepo!.dir]);
                close();
            "
            :disabled="contextmenuRepoIsCurrent"
        >
            移除此仓库
        </Button.Danger>
    </div>
</template>
