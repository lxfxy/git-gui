import { effect, reactive, watch } from "vue";
import { merge } from "lodash";
import {
    gitMergeAbort,
    gitRebaseAbort,
    gitRebaseSkip,
    isMerge,
    isRebaseMerge,
    loop,
    readMergeMsg,
    readRebaseMergeMsg,
    repoChangeWatch,
} from "@/utils";
import { message } from "@/utils/globalApis";
import { MessageReactive, NAlert, NButton } from "naive-ui";
import { tw } from "twind";
import { curRepoBranch } from "./repoBranch";
import { readTextFile } from "@tauri-apps/api/fs";
import { curRepoDir } from "./repo";
import { center } from "@/styles";
import { useQuery } from "@tanstack/vue-query";

export interface PushingMsg {
    remoteName?: string;
}
export interface RepoStatus {
    isPushing: Record<string, boolean>;
    isRemoteRefetching: Record<string, boolean>;
    pushingMsg: Record<string, PushingMsg>;
    isRebaseMerge: boolean;
    rebaseMergeMsg?: {
        num: number;
        end: number;
        message: string;
    };
    isMerge: boolean;
    mergeMsg?: {
        message: string;
    };
}
export const repoStatus = reactive<RepoStatus>({
    isPushing: {},
    pushingMsg: {},
    isRemoteRefetching: {},
    isRebaseMerge: false,
    isMerge: false,
});

export const setRepoStatus = (newStatus: Partial<RepoStatus>) => {
    merge(repoStatus, newStatus);
};

export let rebaseMergeMessageReactive: MessageReactive | null;
export const getRebaseMergeMsg = async () => {
    if (repoStatus.isRebaseMerge) {
        repoStatus.rebaseMergeMsg = await readRebaseMergeMsg(curRepoDir.value!);
    }
};
export const showRebaseMergeDialog = async (reset = false) => {
    rebaseMergeMessageReactive?.destroy();
    if (repoStatus.isRebaseMerge) {
        rebaseMergeMessageReactive = message.value?.warning(
            () => {
                return <div></div>;
            },
            {
                duration: 0,
                render() {
                    const rebaseMergeMsg = repoStatus.rebaseMergeMsg;
                    return (
                        <div
                            style={{
                                color: "var(--rebase-merge-color)",
                                border: "1px solid var(--rebase-merge-color)",
                                backgroundColor: "var(--rebase-merge-bg-color)",
                            }}
                            class={tw`p-[10px] text-center`}
                        >
                            <div class={tw`flex gap-x-[10px] items-center`}>
                                正在处理变基冲突
                                <code>
                                    {rebaseMergeMsg?.num}/{rebaseMergeMsg?.end}
                                </code>
                                <NButton
                                    ghost
                                    type="warning"
                                    onClick={() => gitRebaseAbort()}
                                >
                                    退出变基
                                </NButton>
                                <NButton
                                    ghost
                                    type="warning"
                                    onClick={() => gitRebaseSkip()}
                                >
                                    不处理本次冲突
                                </NButton>
                            </div>
                            <div class={tw`mt-[6px]`}>
                                处理完所有冲突后，提交commit，即可处理下一个冲突！
                            </div>
                        </div>
                    );
                },
            }
        )!;
    } else {
        repoStatus.rebaseMergeMsg = undefined;
    }
};
export let mergeMessageReactive: MessageReactive | null;
export const getMergeMsg = async () => {
    if (repoStatus.isMerge) {
        repoStatus.mergeMsg = {
            message: await readMergeMsg(),
        };
    }
};
export let showMergeDialog = async () => {
    mergeMessageReactive?.destroy();
    if (repoStatus.isMerge) {
        mergeMessageReactive = message.value?.warning(
            () => {
                return <div></div>;
            },
            {
                duration: 0,
                render() {
                    const rebaseMergeMsg = repoStatus.rebaseMergeMsg;
                    return (
                        <div
                            style={{
                                color: "var(--rebase-merge-color)",
                                border: "1px solid var(--rebase-merge-color)",
                                backgroundColor: "var(--rebase-merge-bg-color)",
                            }}
                            class={tw`p-[10px] text-center`}
                        >
                            <div
                                class={tw`flex gap-x-[10px] ${center} items-center`}
                            >
                                正在处理合并冲突
                                <NButton
                                    ghost
                                    type="warning"
                                    onClick={() => gitMergeAbort()}
                                >
                                    退出合并
                                </NButton>
                            </div>
                            <div class={tw`mt-[6px]`}>
                                处理完所有冲突后，提交commit，即可完成合并！
                            </div>
                        </div>
                    );
                },
            }
        )!;
    } else {
        mergeMessageReactive?.destroy();
        mergeMessageReactive = null;
        repoStatus.mergeMsg = undefined;
    }
};
export const checkMerge = async () => {
    [repoStatus.isRebaseMerge, repoStatus.isMerge] = await Promise.all([
        isRebaseMerge(),
        isMerge(),
    ]);
    getRebaseMergeMsg();
    getMergeMsg();
};
watch(
    () => repoStatus.isMerge,
    () => {
        showMergeDialog();
    }
);
watch(
    () => repoStatus.isRebaseMerge,
    () => {
        showRebaseMergeDialog();
    }
);
// effect(checkMerge);
// repoChangeWatch(checkMerge);
loop(checkMerge);
