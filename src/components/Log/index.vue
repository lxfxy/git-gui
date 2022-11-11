<script setup lang="ts">
import { tw } from "twind";
import { logsInfinityQuery, repoLogs } from "@/store";
import {
    NCode,
    NEllipsis,
    NInput,
    NScrollbar,
    NTime,
    NTooltip,
} from "naive-ui";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { observer, unObserver } from "@/utils/intersectionObserver";

const { fetchNextPage } = logsInfinityQuery();
const endEl = ref<HTMLDivElement>();
onMounted(() => {
    observer(endEl.value!, fetchNextPage);
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
        <NScrollbar :class="tw`flex-1`">
            <div
                v-for="item in repoLogs"
                :key="item.Hash"
                :class="tw`px-[8px] py-[6px] flex gap-x-[10px] items-center`"
            >
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
            <div
                :class="tw`w-full bg-bgColor1 h-[30px] opacity-0`"
                ref="endEl"
            ></div>
        </NScrollbar>
    </div>
</template>
