<script setup lang="ts">
import Button from "@/components/Button.vue";
import Opacity from "@/components/Transiton/Opacity.vue";
import { useContextmenu } from "@/hooks";
import {
    changeBranch,
    contextmenuBranch,
    curRepoDir,
    repoBranchs,
    repoStatus,
    setContextmenuBranch,
} from "@/store";
import { addBranch, GitBranch, gitRemoteUpdate } from "@/utils";
import { apply, css } from "@twind/core";
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
import { Ref, ref } from "vue";
import BranchOperation from "./BranchOperation.vue";

const container = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const { x, y, show, open, close } = useContextmenu({ container });
const contextmenu = (branch: GitBranch, e: MouseEvent) => {
    if (!repoStatus.isRebaseMerge && !repoStatus.isMerge) {
        e.preventDefault();
        setContextmenuBranch(branch);
        open();
    }
};
</script>

<template>
    <div :class="`flex-1 flex-col flex overflow-hidden`" ref="container">
        <NPopover
            :x="x"
            :y="y"
            trigger="manual"
            v-model:show="show"
            placement="right"
        >
            <BranchOperation />
        </NPopover>
        <div :class="`title flex justify-between items-center`">
            <div>分支信息</div>
            <NButtonGroup>
                <NTooltip>
                    <template #trigger>
                        <Button
                            quaternary
                            type="success"
                            @click="gitRemoteUpdate()"
                            :disabled="
                                repoStatus.isRebaseMerge || repoStatus.isMerge
                            "
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
                            :disabled="
                                repoStatus.isRebaseMerge || repoStatus.isMerge
                            "
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
        <NScrollbar :class="`flex-1 text-color1`" @scroll="close">
            <div
                v-for="item in repoBranchs"
                :key="`${item.name}${curRepoDir}`"
                :type="
                    item.current ? `success` : item.remotes ? `info` : `default`
                "
                :class="[
                    `select-none transition-all duration-[300ms] h-[38px] items-center flex gap-x-[4px] px-[16px]`,
                    item.heads ? `cursor-pointer` : ``,
                    `${css`
                        & .branch-content {
                            @apply ${apply`opacity-${
                                item.current ? `100` : item.heads ? `60 ` : `60`
                            }`};
                            @apply ${apply`transition-all duration-[300ms]`};
                        }

                        &:hover,
                        &.context-active {
                            @apply ${apply`bg-bgColor1`};
                        }

                        &:hover .branch-content,
                        &.context-active .branch-content {
                            @apply ${apply(
                                item.heads ? `opacity-100` : `opacity-80`
                            )};
                        }
                    `}`,
                    { 'context-active': contextmenuBranch === item && show },
                ]"
                @dblclick="item.heads ? changeBranch(item) : null"
                @contextmenu="contextmenu(item, $event)"
            >
                <NEllipsis
                    :class="[
                        `flex-1 overflow-hidden`,
                        `items-center flex gap-x-[4px] overflow-hidden`,
                        `branch-content`,
                    ]"
                >
                    <code>{{ item.name }}</code>
                    <code v-show="item.upstream" :class="`text-color2`">
                        -> {{ item.upstream }}
                    </code>
                </NEllipsis>
                <span :class="`text-[12px] ml-[4px]`">
                    <NTime
                        v-if="item.updateDate"
                        type="relative"
                        :time="new Date(item.updateDate)"
                        :to="new Date()"
                    >
                    </NTime>
                </span>
                <Opacity>
                    <template v-if="item.heads">
                        <div
                            :class="[`flex items-center h-full mx-[12px]`]"
                            v-show="repoStatus.isPushing[item.branchname]"
                        >
                            <NTooltip placement="right">
                                <template #trigger>
                                    <NSpin :class="[`w-[20px] h-[20px]`]" />
                                </template>
                                正在推送至
                                <code :class="[`ml-[4px]`]">
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
                            :class="[`flex items-center h-full mx-[12px]`]"
                            v-show="repoStatus.isRemoteRefetching[item.name]"
                        >
                            <NTooltip placement="right">
                                <template #trigger>
                                    <NSpin :class="[`w-[20px] h-[20px]`]" />
                                </template>
                                正在拉取此远程分支
                                <code :class="[`mx-[4px]`]">
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
