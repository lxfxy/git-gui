<script setup lang="tsx">
import Button from "./Button";
import {
    contextmenuBranch,
    changeBranch,
    curRepoBranch,
    repoStatus,
    repoBranchs,
    getUpstreamBranch,
} from "@/store";
import {
    addBranch,
    branchDel,
    gitPush,
    gitRebase,
    chooseBranchRebase,
} from "@/utils";
import { NTooltip } from "naive-ui";
import { tw } from "@twind/core";
import { computed } from "vue";
import { gitFetch } from "@/utils/gitFetch";
import { gitPull } from "@/utils/gitPull";
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
const rebaseToHEAD = () => {
    gitRebase({
        target: contextmenuBranch.value!.name,
        branch: curRepoBranch.value!.name,
    });
};
const fetch = async () => {
    await gitFetch({
        remoteBranch: getUpstreamBranch(contextmenuBranch.value!)!,
    });
};
const pull = async (rebase: boolean = false) => {
    await gitPull({
        remote: getUpstreamBranch(contextmenuBranch.value!)!,
        rebase,
    });
};
const contextBranchIsCurrent = computed(() => {
    return contextmenuBranch.value?.name === curRepoBranch.value?.name;
});
const isPushing = computed(() => {
    return repoStatus.isPushing[contextmenuBranch.value!.name];
});
const isRemoteFetching = computed(() => {
    return repoStatus.isRemoteRefetching[contextmenuBranch.value!.name];
});
</script>

<template>
    <div :class="`flex flex-col`">
        <!-- <code :class="`text-center my-[6px]`">
            {{ contextmenuBranch?.name }}
        </code> -->

        <Button @click="reabseTo"> 将此分支变基至 </Button>
        <Button @click="rebaseToHEAD" :disabled="contextBranchIsCurrent">
            将此分支变基至<code>HEAD</code>
        </Button>

        <template v-if="isRemoteBranch">
            <Button @click="fetch" :disabled="isRemoteFetching">
                拉取此远程分支的信息
            </Button>
            <Button @click="pull(true)" :disabled="isRemoteFetching">
                拉取此远程分支的信息并变基到当前分支
            </Button>
            <Button @click="pull(false)" :disabled="isRemoteFetching">
                拉取此远程分支的信息并合并到当前分支
            </Button>
        </template>
        <template v-else>
            <template v-if="contextmenuBranch?.upstream">
                <Button @click="fetch" :disabled="isRemoteFetching">
                    拉取此分支上游分支的信息
                </Button>
                <Button @click="pull(true)" :disabled="isRemoteFetching">
                    拉取此分支上游分支的信息并<b>变基</b>到当前分支
                </Button>
                <Button @click="pull(false)" :disabled="isRemoteFetching">
                    拉取此分支上游分支的信息并<b>合并</b>到当前分支
                </Button>
            </template>
            <Button :disabled="contextBranchIsCurrent" @click="rebase">
                将<code>HEAD</code>变基至此分支
            </Button>
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
            <Button :disabled="isRemoteBranch || isPushing" @click="push">
                推送
            </Button>
            <Button :disabled="isRemoteBranch || isPushing" @click="pushTo">
                推送至
            </Button>
            <Button :disabled="isRemoteBranch || isPushing" @click="forcePush">
                强制推送
            </Button>
            <Button
                :disabled="isRemoteBranch || isPushing"
                @click="forcePushTo"
            >
                强制推送至
            </Button>
        </template>
        <Button.Danger
            @click="branchDel(contextmenuBranch!)"
            :disabled="contextBranchIsCurrent"
        >
            删除此分支
        </Button.Danger>
        <Button.Danger
            @click="branchDel(contextmenuBranch!, true)"
            :disabled="contextBranchIsCurrent"
        >
            强制删除此分支
        </Button.Danger>
        <Button @click="addBranch({ anchor: contextmenuBranch!.name })">
            基于此分支创建新分支
        </Button>
    </div>
</template>
