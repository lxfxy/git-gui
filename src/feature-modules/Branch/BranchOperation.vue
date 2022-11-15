<script setup lang="tsx">
import Button from "./Button";
import { contextmenuBranch, changeBranch, curRepoBranch } from "@/store";
import { branchDel, gitPush } from "@/utils";
import { NTooltip } from "naive-ui";
import { tw } from "twind";
import { computed } from "vue";
const isRemoteBranch = computed(() => {
    return !!contextmenuBranch.value?.remotes;
});
const push = () => {
    gitPush({ branch: contextmenuBranch.value! });
};
const pushTo = () => {
    gitPush({ branch: contextmenuBranch.value!, chooseBranchs: true });
};
const forcePush = () => {
    gitPush({ branch: contextmenuBranch.value!, force: true });
};
const forcePushTo = () => {
    gitPush({
        branch: contextmenuBranch.value!,
        force: true,
        chooseBranchs: true,
    });
};
</script>

<template>
    <div :class="tw`flex flex-col`">
        <!-- <code :class="tw`text-center my-[6px]`">
            {{ contextmenuBranch?.name }}
        </code> -->
        <template v-if="!isRemoteBranch">
            <NTooltip>
                <template #trigger>
                    <Button
                        :disabled="
                            isRemoteBranch ||
                            curRepoBranch?.name === contextmenuBranch?.name
                        "
                        @click="changeBranch(contextmenuBranch!)"
                    >
                        切换到当前分支
                    </Button>
                </template>
                <span v-show="isRemoteBranch">
                    当前分支是远程分支不可切换
                </span>
                <span v-show="!isRemoteBranch"> 双击也可以切换分支哦~</span>
            </NTooltip>
            <Button :disabled="isRemoteBranch" @click="push"> 推送 </Button>
            <Button :disabled="isRemoteBranch" @click="pushTo"> 推送至 </Button>
            <Button :disabled="isRemoteBranch" @click="forcePush">
                强制推送
            </Button>
            <Button :disabled="isRemoteBranch" @click="forcePushTo">
                强制推送至
            </Button>
        </template>
        <Button.Danger @click="branchDel(contextmenuBranch!)">
            删除当前分支
        </Button.Danger>
    </div>
</template>
