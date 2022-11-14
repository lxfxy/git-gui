import { loop, sleep, GitLog, gitLog } from "@/utils";
// import { GitLog, gitLog } from "@/utils/gitLog";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import { last } from "lodash";
import { effect, onBeforeUnmount, reactive, ref, watch } from "vue";
import { curRepoDir } from "./repo";
import { curRepoBranch } from "./repoBranch";

export const logLimit = 20;
export const repoLogs = reactive<GitLog[]>([]);
export const repoLogsMsg = reactive<Record<string, string>>({});
const refetchs: Set<Function> = new Set();
export const logsInfinityQuery = () => {
    const query = useInfiniteQuery(
        ["logs", curRepoDir, curRepoBranch.value?.name],
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
    () => [curRepoDir.value, curRepoBranch.value],
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
