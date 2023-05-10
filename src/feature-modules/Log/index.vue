<script setup lang="tsx">
import Button from "@/components/Button.vue";
import {
    curRepoBranch,
    logLimit,
    logsInfinityQuery,
    repoLogs,
    repoStatus,
} from "@/store";
import { gitPush } from "@/utils";
import { observer, unObserver } from "@/utils/intersectionObserver";
import { ArrowDownSharp } from "@vicons/ionicons5";
import { CloudUploadOutlined } from "@vicons/material";
import { last } from "lodash";
import { NEllipsis, NIcon, NScrollbar, NTime, NTooltip } from "naive-ui";
import { onBeforeUnmount, onMounted, ref } from "vue";
import LogPopover from "./LogPopover.vue";

const { fetchNextPage, data, isFetchingNextPage } = logsInfinityQuery();
const endEl = ref<HTMLDivElement>();
const scrollbarRef = ref<GetCompSetupReturn<typeof NScrollbar>>();
const fetchNext = async () => {
    await fetchNextPage();
};
onMounted(() => {
    observer(endEl.value!, fetchNext);
});
onBeforeUnmount(() => {
    unObserver(endEl.value!);
});
</script>

<template>
    <div :class="`flex-1 flex flex-col overflow-hidden text-color1`">
        <div :class="`title flex gap-x-[6px] items-center justify-between`">
            <div :class="``">
                <div>提交历史</div>
            </div>
            <NTooltip>
                <template #trigger>
                    <Button
                        :disabled="
                            repoStatus.isPushing?.[
                                curRepoBranch?.branchname || ``
                            ] ||
                            repoStatus.isRebaseMerge ||
                            repoStatus.isMerge
                        "
                        :loading="
                            repoStatus.isPushing?.[
                                curRepoBranch?.branchname || ``
                            ]
                        "
                        type="success"
                        quaternary
                        @click="gitPush({ branch: curRepoBranch! })"
                    >
                        <template #icon>
                            <NIcon size="24">
                                <CloudUploadOutlined />
                            </NIcon>
                        </template>
                    </Button>
                </template>
                推送至上游分支
            </NTooltip>
        </div>
        <div :class="`text-[12px] text-color2`" v-show="false">
            更新于
            <NTime
                v-if="repoLogs[0]"
                :time="new Date(repoLogs[0].Date)"
                :to="Date.now()"
                type="relative"
            />
        </div>
        <NScrollbar :class="`flex-1 w-full`" ref="scrollbarRef">
            <NTooltip
                v-for="(item, index) in repoLogs"
                :key="item.Hash"
                placement="right"
            >
                <template #trigger>
                    <div
                        :class="`px-[8px] py-[6px] w-full`"
                        :style="{
                            backgroundColor: `var(--bg-${
                                index % 2 === 0 ? `color2` : `color3`
                            })`,
                        }"
                    >
                        <div
                            :class="[
                                `relative inline-block mb-[10px] text-[12px] px-[6px]`,
                            ]"
                            :style="{
                                color: `var(--log-ref-color)`,
                                backgroundColor: `var(--log-ref-bg)`,
                                border: `1px solid var(--log-ref-color)`,
                            }"
                            v-show="item.Ref"
                        >
                            <code
                                :class="`break-words whitespace-normal leading-[16px] overflow-hidden`"
                            >
                                {{ item.Ref }}
                            </code>
                            <NIcon
                                :class="`left-[10px] bottom-[-12px] absolute`"
                            >
                                <ArrowDownSharp />
                            </NIcon>
                        </div>
                        <div :class="`flex gap-x-[10px] items-center`">
                            <NEllipsis :class="`max-w-[50%]`" :tooltip="false">
                                {{ item.Subject }}
                            </NEllipsis>
                            <NEllipsis>
                                <code :class="`text-color2 text-[12px]`">
                                    {{ item.Author }}
                                    <NTime
                                        :time="new Date(item.Date)"
                                        :to="Date.now()"
                                        type="relative"
                                    />
                                </code>
                            </NEllipsis>
                        </div>
                    </div>
                </template>
                <LogPopover :log="item" />
            </NTooltip>
            <div ref="endEl">
                <Button
                    @click="fetchNext"
                    :loading="isFetchingNextPage"
                    block
                    quaternary
                    type="success"
                >
                    <span
                        v-if="last(data?.pages)?.length && last(data?.pages)!.length > logLimit"
                    >
                        加载更多
                    </span>
                    <span v-else>到底了</span>
                </Button>
            </div>
        </NScrollbar>
    </div>
</template>
