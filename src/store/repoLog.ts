import { GitLog, gitLog } from "@/utils/gitLog";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { last } from "lodash";
import { effect, reactive, ref } from "vue";
import { curRepoDir } from "./repo";

// 多出一条是下次加载的开始，git log [多出一条的hash] -20
const limit = 20;
export const repoLogs = ref<GitLog[]>([]);
export const repoLogsMsg = reactive<Record<string, string>>({});
export const logsInfinityQuery = () => {
    const query = useInfiniteQuery(
        ["logs", curRepoDir.value],
        ({}) => {
            const date = last(repoLogs.value)!.Timestamp;
            return gitLog({
                args: [`-${limit}`, `--before=${+date - 1}`],
            });
        },
        {
            onSuccess(data) {
                repoLogs.value.push(...last(data.pages)!);
            },
            enabled: false,
        }
    );
    return {
        ...query,
        fetchNextPage(options) {
            if (repoLogs.value.length >= limit) {
                return query.fetchNextPage(options);
            }
        },
    } as typeof query;
};
effect(async () => {
    repoLogs.value = await gitLog({ args: [`-${limit}`] });
});
