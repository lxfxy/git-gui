<script setup lang="ts">
import Button from "@/components/Button.vue";
import { useContextmenu } from "@/hooks";
import {
    repoBranchs,
    changeBranch,
    setContextmenuBranch,
    repoStatus,
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
    NTime,
    NTimeline,
    NTimelineItem,
    NTooltip,
} from "naive-ui";
import { tw } from "twind";
import { Ref, ref } from "vue";
import BranchOperation from "./BranchOperation.vue";

const container = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const { x, y, show, open, close } = useContextmenu({ container });
const contextmenu = (branch: GitBranch, e: MouseEvent) => {
    e.preventDefault();
    setContextmenuBranch(branch);
    open();
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
        <div :class="tw`title flex justify-between`">
            <div>分支信息</div>
            <NButtonGroup>
                <NTooltip>
                    <template #trigger>
                        <Button
                            quaternary
                            type="success"
                            @click="gitRemoteUpdate()"
                            :loading="repoStatus.isRemoteRefetching"
                            :disabled="repoStatus.isRemoteRefetching"
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
                        <Button quaternary type="success" @click="addBranch()">
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
        <NScrollbar :class="tw`flex-1 text-color1 px-[10px]`" @scroll="close">
            <NTimeline :class="tw`py-[6px]`">
                <NTimelineItem
                    v-for="item in repoBranchs"
                    :key="item.name"
                    :type="
                        item.current
                            ? `success`
                            : item.remotes
                            ? `info`
                            : `default`
                    "
                    :class="
                        tw`opacity-${
                            item.current ? `100` : item.heads ? `60 ` : `60`
                        } ${
                            item.heads
                                ? `hover:opacity-100 cursor-pointer`
                                : `hover:opacity-60 cursor-not-allowed`
                        } select-none transition-opacity`
                    "
                    @dblclick="item.heads ? changeBranch(item) : null"
                    @contextmenu="contextmenu(item, $event)"
                >
                    <NEllipsis>
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
                </NTimelineItem>
            </NTimeline>
        </NScrollbar>
    </div>
</template>
