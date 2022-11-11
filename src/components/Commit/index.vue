<script setup lang="ts">
import {
    curRepo,
    repoHistoryFileStatus,
    repoLogs,
    theme,
    ThemeType,
} from "@/store";
import { commitRepo } from "@/utils";
import { getGitLogMsg } from "@/utils/gitLog";
import { isEmpty } from "lodash";
import {
    NButton,
    NCheckbox,
    NDivider,
    NInput,
    NPopover,
    useMessage,
} from "naive-ui";
import { tw } from "twind";
import { effect, ref, watch, watchEffect } from "vue";
import Gitmoji from "./Gitmoji.vue";
const dividerTheme: Record<ThemeType, any> = {
    dark: {},
    light: {
        color: "#ddd",
    },
};
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
    const input = inputCompRef.value
        ?.textareaElRef as unknown as HTMLTextAreaElement;

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
    if (isEmpty(repoHistoryFileStatus.value)) {
        message.error("暂存区无内容");
        return;
    }
    await commitRepo(msg.value);
    message.success("提交成功");
    msg.value = "";
    commitMsg.value = "";
    amendMsg.value = "";
};
const getLastCommitMsg = async () => {
    amendMsg.value = await getGitLogMsg(repoLogs.value[0].Hash);
};
</script>

<template>
    <div :class="tw`bg-bgColor1 text-color1`">
        <div :class="tw`title flex justify-between items-center h-[50px]`">
            <div :class="tw`flex items-center gap-x-[10px]`">
                <code>Commit</code>
                <NDivider
                    vertical
                    :builtin-theme-overrides="dividerTheme[theme]"
                />
                <NPopover :class="tw`p-0!`" v-model:show="gitmojiVisible">
                    <template #trigger>
                        <NButton quaternary>
                            <code>gitmoji</code>
                        </NButton>
                    </template>
                    <Gitmoji @select="inputGitmoji" />
                </NPopover>
                <NCheckbox v-model:checked="isCommitAmend">
                    修订最后一次更改
                </NCheckbox>
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
                v-model:value="msg"
                :class="tw`text-[18px]`"
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
