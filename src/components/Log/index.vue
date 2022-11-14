<script setup lang="tsx">
import { apply, tw } from "twind";
import { css } from "twind/css";
import {
    logsInfinityQuery,
    repoLogs,
    logLimit,
    curRepoBranch,
    repoStatus,
} from "@/store";
import {
    NButton,
    NEllipsis,
    NIcon,
    NScrollbar,
    NSpin,
    NTag,
    NTime,
    NTooltip,
} from "naive-ui";
import {
    effect,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
} from "vue";
import { observer, unObserver } from "@/utils/intersectionObserver";
import { last } from "lodash";
import Opacity from "../Transiton/Opacity.vue";
import { setLoadingBarRenderEl } from "../LoadingBar";
import { ArrowDownSharp } from "@vicons/ionicons5";
import { CloudUploadOutlined } from "@vicons/material";
import { gitPush } from "@/utils";

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
    <div :class="tw`flex-1 flex flex-col overflow-hidden text-color1`">
        <div :class="tw`title flex gap-x-[6px] items-center justify-between`">
            <div :class="tw` `">
                <div>提交历史</div>
            </div>
            <NTooltip>
                <template #trigger>
                    <NButton
                        :disabled="repoStatus.isPushing"
                        type="success"
                        quaternary
                        @click="gitPush({ branch: curRepoBranch! })"
                    >
                        <NIcon size="24">
                            <CloudUploadOutlined />
                        </NIcon>
                    </NButton>
                </template>
                推送至上游分支
            </NTooltip>
        </div>
        <div :class="tw`text-[12px] text-color2`" v-show="false">
            更新于
            <NTime
                v-if="repoLogs[0]"
                :time="new Date(repoLogs[0].Date)"
                :to="Date.now()"
                type="relative"
            />
        </div>
        <NScrollbar :class="tw`flex-1 w-full`" ref="scrollbarRef">
            <div
                v-for="item in repoLogs"
                :key="item.Hash"
                :class="tw`px-[8px] py-[6px] w-full`"
            >
                <div
                    :class="
                        tw`relative inline-block my-[10px] text-[12px] px-[6px]`
                    "
                    :style="{
                        color: `var(--log-ref-color)`,
                        backgroundColor: `var(--log-ref-bg)`,
                        border: `1px solid var(--log-ref-color)`,
                    }"
                    v-show="item.Ref"
                >
                    <code
                        :class="
                            tw`break-words whitespace-normal leading-[16px] overflow-hidden`
                        "
                    >
                        {{ item.Ref }}
                    </code>
                    <NIcon :class="tw`left-[10px] bottom-[-12px] absolute`">
                        <ArrowDownSharp />
                    </NIcon>
                </div>
                <div :class="tw`flex gap-x-[10px] items-center`">
                    <NEllipsis :class="tw`max-w-[50%]!`" :tooltip="false">
                        {{ item.Subject }}
                        <!-- {{ Date.now() }} -->
                    </NEllipsis>
                    <code :class="tw`text-color2 text-[12px]`">
                        {{ item.Author }}
                        <NTime
                            :time="new Date(item.Date)"
                            :to="Date.now()"
                            type="relative"
                        />
                    </code>
                </div>
            </div>
            <div
                ref="endEl"
                @click="fetchNext"
                :class="tw`w-full h-[36px] center cursor-pointer`"
            >
                <NSpin
                    size="small"
                    :class="tw`w-[18px] h-[18px] mr-[10px] transition-all`"
                    :style="{ opacity: isFetchingNextPage ? 1 : 0 }"
                />
                <span
                    v-if="last(data?.pages)?.length && last(data?.pages)!.length > logLimit"
                >
                    加载更多
                </span>
                <span v-else>到底了</span>
            </div>
        </NScrollbar>
    </div>
</template>
