<script setup lang="ts">
import Button from "@/components/Button.vue";
import Opacity from "@/components/Transiton/Opacity.vue";
import { useContextmenu } from "@/hooks";
import {
    repoBranchs,
    changeBranch,
    setContextmenuBranch,
    repoStatus,
    contextmenuBranch,
} from "@/store";
import { GitBranch, gitRemoteUpdate, addBranch } from "@/utils";
import { Add } from "@vicons/ionicons5";
import { CloudSyncOutlined } from "@vicons/material";
import {
    NButtonGroup,
    NEllipsis,
    NIcon,
    NPopover,
    NScrollbar,
    NSpin,
    NTime,
    NTooltip,
} from "naive-ui";
import { apply, tw } from "twind";
import { css } from "twind/css";
import { Ref, ref } from "vue";
import BranchOperation from "./BranchOperation.vue";

const container = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const { x, y, show, open, close } = useContextmenu({ container });
const contextmenu = (branch: GitBranch, e: MouseEvent) => {
    if (!repoStatus.isRebaseMerge) {
        e.preventDefault();
        setContextmenuBranch(branch);
        open();
    }
};
</script>

<template>
    <div :class="tw`flex-1 flex-col flex overflow-hidden`" ref="container">
        <NPopover
            :x="x"
            :y="y"
            trigger="manual"
            v-model:show="show"
            placement="right"
        >
            <BranchOperation />
        </NPopover>
        <div :class="tw`title flex justify-between items-center`">
            <div>分支信息</div>
            <NButtonGroup>
                <NTooltip>
                    <template #trigger>
                        <Button
                            quaternary
                            type="success"
                            @click="gitRemoteUpdate()"
                            :disabled="repoStatus.isRebaseMerge"
                        >
                            <template #icon>
                                <NIcon size="24">
                                    <CloudSyncOutlined />
                                </NIcon>
                            </template>
                        </Button>
                    </template>
                    同步远程仓库分支
                </NTooltip>
                <NTooltip>
                    <template #trigger>
                        <Button
                            quaternary
                            type="success"
                            @click="addBranch()"
                            :disabled="repoStatus.isRebaseMerge"
                        >
                            <template #icon>
                                <NIcon size="24">
                                    <Add />
                                </NIcon>
                            </template>
                        </Button>
                    </template>
                    添加分支
                </NTooltip>
            </NButtonGroup>
        </div>
        <NScrollbar :class="tw`flex-1 text-color1`" @scroll="close">
            <div
                v-for="item in repoBranchs"
                :key="item.name"
                :type="
                    item.current ? `success` : item.remotes ? `info` : `default`
                "
                :class="[
                    tw`select-none transition-all duration-[300ms] h-[38px] items-center flex gap-x-[4px]`,
                    tw`${css`
                        ${apply`${item.heads ? `cursor-pointer` : ``}`}
                        .branch-content {
                            ${apply`opacity-${
                                item.current ? `100` : item.heads ? `60 ` : `60`
                            }`}
                            ${apply`transition-all duration-[300ms]`}
                        }

                        &:hover,
                        &.context-active {
                            ${apply`bg-bgColor1`}
                        }

                        &:hover .branch-content,
                        &.context-active .branch-content {
                            ${apply(item.heads ? `opacity-100` : `opacity-80`)}
                        }
                    `}`,
                    { 'context-active': contextmenuBranch === item && show },
                ]"
                @dblclick="item.heads ? changeBranch(item) : null"
                @contextmenu="contextmenu(item, $event)"
            >
                <div
                    :class="[
                        tw`flex-1 items-center flex gap-x-[4px] ml-[16px]`,
                        `branch-content`,
                    ]"
                >
                    <NEllipsis :class="[tw`max-w-[80%]`]">
                        <code>{{ item.name }}</code>
                        <code v-show="item.upstream" :class="tw`text-color2`">
                            -> {{ item.upstream }}
                        </code>
                    </NEllipsis>
                    <span :class="tw`text-[12px] ml-[4px]`">
                        <NTime
                            v-if="item.updateDate"
                            type="relative"
                            :time="new Date(item.updateDate)"
                            :to="new Date()"
                        >
                        </NTime>
                    </span>
                </div>
                <Opacity>
                    <template v-if="item.heads">
                        <div
                            :class="[tw`flex items-center h-full mx-[12px]`]"
                            v-show="repoStatus.isPushing[item.branchname]"
                        >
                            <NTooltip placement="right">
                                <template #trigger>
                                    <NSpin :class="[tw`w-[20px] h-[20px]`]" />
                                </template>
                                正在推送至
                                <code :class="[tw`ml-[4px]`]">
                                    {{
                                        repoStatus.pushingMsg[item.branchname]
                                            .remoteName
                                    }}
                                </code>
                            </NTooltip>
                        </div>
                    </template>
                    <template v-else>
                        <div
                            :class="[tw`flex items-center h-full mx-[12px]`]"
                            v-show="repoStatus.isRemoteRefetching[item.name]"
                        >
                            <NTooltip placement="right">
                                <template #trigger>
                                    <NSpin :class="[tw`w-[20px] h-[20px]`]" />
                                </template>
                                正在拉取此远程分支
                                <code :class="[tw`mx-[4px]`]">
                                    {{ item.name }}
                                </code>
                                的最新信息
                            </NTooltip>
                        </div>
                    </template>
                </Opacity>
            </div>
        </NScrollbar>
    </div>
</template>
