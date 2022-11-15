<script setup lang="ts">
import { repoBranchs, changeBranch, setContextmenuBranch } from "@/store";
import { GitBranch, gitSwitch } from "@/utils";
import {
    NEllipsis,
    NPopover,
    NScrollbar,
    NTimeline,
    NTimelineItem,
    useMessage,
} from "naive-ui";
import { tw } from "twind";
import { onBeforeUnmount, ref } from "vue";
import BranchOperation from "./BranchOperation.vue";

const message = useMessage();
const xRef = ref<number>(0);
const yRef = ref<number>(0);
const show = ref<boolean>(false);
const contextmenu = (branch: GitBranch, e: MouseEvent) => {
    e.preventDefault();
    setContextmenuBranch(branch);
    show.value = true;
    xRef.value = e.clientX;
    yRef.value = e.clientY;
};
const closeBranchOperationPopover = () => {
    show.value = false;
};
document.addEventListener("click", closeBranchOperationPopover);
</script>

<template>
    <div :class="tw`flex-1 flex-col flex overflow-hidden`">
        <div :class="tw`title`">分支信息</div>
        <NPopover
            :x="xRef"
            :y="yRef"
            trigger="manual"
            v-model:show="show"
            :show-arrow="true"
        >
            <BranchOperation />
        </NPopover>
        <NScrollbar
            :class="tw`flex-1 text-color1 px-[10px]`"
            @scroll="closeBranchOperationPopover"
        >
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
                            item.current ? `100` : item.heads ? `40 ` : `40`
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
                </NTimelineItem>
            </NTimeline>
        </NScrollbar>
    </div>
</template>
