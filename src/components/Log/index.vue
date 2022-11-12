<script setup lang="ts">
import { tw } from "twind";
import { logsInfinityQuery, repoLogs, logLimit } from "@/store";
import {
    NButton,
    NCode,
    NEllipsis,
    NIcon,
    NInput,
    NLoadingBarProvider,
    NScrollbar,
    NSpin,
    NTag,
    NTime,
    NTooltip,
    useLoadingBar,
} from "naive-ui";
import { effect, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { observer, unObserver } from "@/utils/intersectionObserver";
import { last } from "lodash";
import Opacity from "../Transiton/Opacity.vue";
import { setLoadingBarRenderEl } from "../LoadingBar";
import { ArrowDownSharp } from "@vicons/ionicons5";

const { fetchNextPage, data, isFetchingNextPage } = logsInfinityQuery();
const endEl = ref<HTMLDivElement>();
const scrollbarRef = ref<GetCompSetupReturn<typeof NScrollbar>>();
const fetchNext = async () => {
    console.log(123);
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
        <div :class="tw`title flex gap-x-[6px] items-end`">
            <div>提交历史</div>
            <div :class="tw`text-[12px] text-color2`" v-show="false">
                更新于
                <NTime
                    v-if="repoLogs[0]"
                    :time="new Date(repoLogs[0].Date)"
                    :to="Date.now()"
                    type="relative"
                />
            </div>
        </div>
        <NScrollbar :class="tw`flex-1`" ref="scrollbarRef">
            <div
                v-for="item in repoLogs"
                :key="item.Hash"
                :class="tw`px-[8px] py-[6px]`"
            >
                <NTag
                    v-if="item.Ref"
                    type="info"
                    :class="tw`my-[6px]`"
                    size="small"
                >
                    <div :class="tw`flex items-end gap-x-[4px] relative`">
                        <code>{{ item.Ref }}</code>
                        <NIcon :class="tw`right-0 bottom-[-14px] absolute`">
                            <ArrowDownSharp />
                        </NIcon>
                    </div>
                </NTag>
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
