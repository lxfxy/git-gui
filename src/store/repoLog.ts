import { GitLog, gitLog } from "@/utils/gitLog";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { last } from "lodash";
import { effect, onBeforeUnmount, reactive, ref, watch } from "vue";
import { curRepoDir } from "./repo";

// 多出一条是下次加载的开始，git log [多出一条的hash] -20
const limit = 20;
export const repoLogs = reactive<GitLog[]>([]);
export const repoLogsMsg = reactive<Record<string, string>>({});
const refetchs: Set<Function> = new Set();
export const logsInfinityQuery = () => {
    const query = useInfiniteQuery(
        ["logs", curRepoDir.value],
        ({ pageParam = Date.now() }) => {
            const date = last(repoLogs)?.Timestamp || Date.now();
            return gitLog({
                args: [`-${limit}`, `--before=${+pageParam - 1}`],
            });
        },
        {
            onSuccess(data) {
                Object.assign(repoLogs, data.pages.flat(2));
                // repoLogs.value = data.pages.flat(2);
            },
            getNextPageParam(prevData) {
                return last(prevData)?.Timestamp;
            },
        }
    );
    refetchs.add(query.refetch);
    onBeforeUnmount(() => {
        refetchs.delete(query.refetch);
    });
    return {
        ...query,
        fetchNextPage(options) {
            if (repoLogs.length >= limit) {
                return query.fetchNextPage(options);
            }
        },
    } as typeof query;
};
watch(
    () => curRepoDir.value,
    () => {
        repoLogs.length = 0;
    }
);
const getLogs = async () => {
    if (curRepoDir.value) {
        await Promise.all([...refetchs].map((refetch) => refetch()));
    }
    setTimeout(() => {
        requestIdleCallback(getLogs);
    }, 600);
};
requestIdleCallback(getLogs);
