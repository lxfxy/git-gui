import { loop, sleep } from "@/utils";
import { GitLog, gitLog } from "@/utils/gitLog";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import { last } from "lodash";
import { effect, onBeforeUnmount, reactive, ref, watch } from "vue";
import { curRepoDir } from "./repo";
import { curBranch } from "./repoBranch";

// 多出一条是下次加载的开始，git log [多出一条的hash] -20
export const logLimit = 20;
export const repoLogs = reactive<GitLog[]>([]);
export const repoLogsMsg = reactive<Record<string, string>>({});
const refetchs: Set<Function> = new Set();
export const logsInfinityQuery = () => {
    const query = useInfiniteQuery(
        ["logs", curRepoDir, curBranch.value?.name],
        ({ pageParam = Date.now() }) => {
            const date = last(repoLogs)?.Timestamp || Date.now();
            return gitLog({
                args: [`-${logLimit}`, `--before=${+pageParam - 1}`],
            });
        },
        {
            onSuccess(data) {
                const logs = data.pages.flat(2);
                repoLogs.length = Math.min(logs.length, repoLogs.length);
                Object.assign(repoLogs, logs);
                // repoLogs.value = data.pages.flat(2);
            },
            getNextPageParam(prevData) {
                return last(prevData)?.Timestamp;
            },
            staleTime: 0,
        }
    );
    refetchs.add(query.refetch);
    onBeforeUnmount(() => {
        refetchs.delete(query.refetch);
    });
    return {
        ...query,
        // fetchNextPage(options) {
        //     if (repoLogs.length >= logLimit) {
        //         return query.fetchNextPage(options);
        //     }
        // },
    } as typeof query;
};
export const refetchLogs = () => {
    return Promise.all([...refetchs].map((refetch) => refetch()));
};
watch(
    () => [curRepoDir.value, curBranch.value],
    () => {
        // repoLogs.length = 0;
        refetchLogs();
    }
);
const getLogs = async () => {
    if (curRepoDir.value) {
        await refetchLogs();
    }
};
loop(getLogs, 1000);
