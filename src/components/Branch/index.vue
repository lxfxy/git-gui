<script setup lang="ts">
import {
    branchs,
    getBranch,
    repoFileStatus,
    repoHistoryFileStatus,
} from "@/store";
import { GitBranch, gitSwitch } from "@/utils";
import {
    NEllipsis,
    NScrollbar,
    NTimeline,
    NTimelineItem,
    useMessage,
} from "naive-ui";
import { tw } from "twind";
import { isEmpty } from "lodash";

const message = useMessage();
const changeBranch = async (branchInfo: GitBranch) => {
    if (
        !isEmpty(repoFileStatus.value) ||
        !isEmpty(repoHistoryFileStatus.value)
    ) {
        message.error("当前工作树不是空的");
        return;
    }
    await gitSwitch(branchInfo.name);
    await getBranch();
};
</script>

<template>
    <div :class="tw`flex-1 flex-col flex overflow-hidden`">
        <div :class="tw`title`">分支信息</div>
        <NScrollbar :class="tw`flex-1 text-color1 px-[10px]`">
            <NTimeline :class="tw`py-[6px]`">
                <NTimelineItem
                    v-for="item in branchs"
                    :key="item.name"
                    :type="item.current ? `success` : `default`"
                    :class="
                        tw`opacity-${
                            item.current ? `100` : item.heads ? `40 ` : `30`
                        } ${
                            item.heads
                                ? `hover:opacity-100 transition-opacity cursor-pointer`
                                : `cursor-not-allowed`
                        } select-none`
                    "
                    @dblclick="item.heads ? changeBranch(item) : null"
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
