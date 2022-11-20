<script setup lang="tsx">
import Button from "./Button";
import { contextmenuBranch, changeBranch, curRepoBranch } from "@/store";
import {
    addBranch,
    branchDel,
    gitPush,
    gitRebase,
    chooseBranchRebase,
} from "@/utils";
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
const rebase = () => {
    gitRebase({
        target: curRepoBranch.value!.name,
        branch: contextmenuBranch.value!.name,
    });
};
const reabseTo = () => {
    chooseBranchRebase({
        branch: contextmenuBranch.value!,
    });
};
const contextBranchIsCurrent = computed(() => {
    return contextmenuBranch.value?.name === curRepoBranch.value?.name;
});
</script>

<template>
    <div :class="tw`flex flex-col`">
        <!-- <code :class="tw`text-center my-[6px]`">
            {{ contextmenuBranch?.name }}
        </code> -->
        <template v-if="!isRemoteBranch">
            <Button :disabled="contextBranchIsCurrent" @click="rebase">
                将<code>HEAD</code>变基至此分支
            </Button>
            <Button @click="reabseTo"> 将此分支变基至 </Button>
            <NTooltip>
                <template #trigger>
                    <Button
                        :disabled="isRemoteBranch || contextBranchIsCurrent"
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
        <Button.Danger
            @click="branchDel(contextmenuBranch!)"
            :disabled="contextBranchIsCurrent"
        >
            删除当前分支
        </Button.Danger>
        <Button.Danger
            @click="branchDel(contextmenuBranch!, true)"
            :disabled="contextBranchIsCurrent"
        >
            强制删除当前分支
        </Button.Danger>
        <Button @click="addBranch({ anchor: contextmenuBranch!.name })">
            基于此分支创建新分支
        </Button>
    </div>
</template>
