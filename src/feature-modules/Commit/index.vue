<script setup lang="ts">
import Divider from "@/components/Divider.vue";
import {
    curRepo,
    repoHistoryFileStatus,
    repoLogs,
    theme,
    ThemeType,
} from "@/store";
import { commitAmendRepo, commitRepo } from "@/utils";
import { getGitLogMsg } from "@/utils/gitLog";
import { AlertCircleSharp, Reload } from "@vicons/ionicons5";
import { isEmpty } from "lodash";
import {
    NButton,
    NCheckbox,
    NDivider,
    NIcon,
    NInput,
    NPopover,
    NTooltip,
    useMessage,
} from "naive-ui";
import { apply, tw } from "twind";
import { css } from "twind/css";
import { ref, watch } from "vue";
import Gitmoji from "./Gitmoji.vue";
const inputCompRef = ref<GetCompSetupReturn<typeof NInput>>();
const cursorPos = {
    start: 0,
    end: 0,
};
const commitMsg = ref("");
const amendMsg = ref("");
const msg = ref("");
const isCommitAmend = ref(false);
watch(
    () => msg.value,
    (val) => {
        if (isCommitAmend.value) {
            amendMsg.value = val;
        } else {
            commitMsg.value = val;
        }
    }
);
watch(
    () => isCommitAmend.value,
    async (flag) => {
        if (flag) {
            if (!amendMsg.value) {
                await getLastCommitMsg();
            }
            msg.value = amendMsg.value;
        } else {
            msg.value = commitMsg.value;
        }
    }
);
const gitmojiVisible = ref(false);
const message = useMessage();
const inputGitmoji = (info: string) => {
    gitmojiVisible.value = false;
    const { start } = cursorPos;
    const currentMsg = msg.value;
    const left = currentMsg.substring(0, start);
    const right = currentMsg.substring(start);
    msg.value = `${left}${info}${right}`;
    const input = inputCompRef.value?.textareaElRef!;

    input?.focus();
    setTimeout(() => {
        cursorPos.start += info.length;
        input?.setSelectionRange(start + info.length, start + info.length);
    });
};
const blur = (event: FocusEvent) => {
    const target = event.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    let pos: number[];
    if (target.selectionDirection === "forward") {
        pos = [end, start];
    } else {
        pos = [start, end];
    }
    [cursorPos.start, cursorPos.end] = pos;
};
const commit = async () => {
    if (curRepo.value === null) {
        message.info("请先选择一个仓库");
        return;
    }
    if (!msg.value.trim()) {
        message.error("请输入本次提交的描述信息");
        return;
    }
    if (isCommitAmend.value) {
        await commitAmendRepo(msg.value);
    } else {
        if (isEmpty(repoHistoryFileStatus.value)) {
            message.error("暂存区无内容");
            return;
        }
        await commitRepo(msg.value);
    }
    message.success("提交成功");
    msg.value = "";
    commitMsg.value = "";
    amendMsg.value = "";
    isCommitAmend.value = false;
};
const getLastCommitMsg = async () => {
    amendMsg.value = msg.value = await getGitLogMsg(repoLogs[0].Hash);
    const input = inputCompRef.value?.textareaElRef!;
    input.focus();
};
const keydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
    }
};
const keyup = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
        commit();
    }
};
</script>

<template>
    <div :class="tw`bg-bgColor1 text-color1`">
        <div :class="tw`title flex justify-between items-center h-[50px]`">
            <div :class="tw`flex items-center gap-x-[6px]`">
                <code>Commit</code>
                <Divider vertical />
                <NPopover :class="tw`p-0!`" v-model:show="gitmojiVisible">
                    <template #trigger>
                        <NButton quaternary>
                            <code>gitmoji</code>
                        </NButton>
                    </template>
                    <Gitmoji @select="inputGitmoji" />
                </NPopover>
                <Divider vertical />
                <NCheckbox v-model:checked="isCommitAmend">
                    修订最后一次更改
                </NCheckbox>
                <NTooltip placement="bottom">
                    <template #trigger>
                        <NButton
                            quaternary
                            round
                            type="success"
                            size="small"
                            @click="getLastCommitMsg"
                            :disabled="!isCommitAmend"
                            :class="
                                tw`${css`
                                    &:hover .n-icon {
                                        ${apply`rotate-180`}
                                    }
                                `}`
                            "
                        >
                            <NIcon size="18px" :class="tw`transition block`">
                                <Reload />
                            </NIcon>
                        </NButton>
                    </template>
                    重新获取最后一次 <code>commit</code> 的描述信息
                </NTooltip>
                <Divider vertical />
                <NTooltip placement="bottom">
                    <template #trigger>
                        <NIcon
                            :class="tw`cursor-pointer text-blue-300`"
                            size="20px"
                        >
                            <AlertCircleSharp />
                        </NIcon>
                    </template>
                    <code>Shift + Enter 换行</code>
                    <br />
                    <code>Enter 提交</code>
                </NTooltip>
            </div>
            <NButton
                quaternary
                type="success"
                @click="commit"
                :disabled="!msg.trim()"
            >
                提交
            </NButton>
        </div>
        <div :class="[tw`p-[10px]`]">
            <NInput
                ref="inputCompRef"
                @blur="blur"
                @keydown="keydown"
                @keyup.enter="keyup"
                v-model:value="msg"
                :class="tw`text-[16px]`"
                type="textarea"
                :autosize="{
                    maxRows: 4,
                    minRows: 4,
                }"
                placeholder="请输入本次提交的描述信息"
                show-count
            ></NInput>
        </div>
    </div>
</template>
