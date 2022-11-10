import apis from "@/apis";
import { GitMoji } from "@/apis/gitmoji";
import { sleep } from "@/utils";
import { readFileToJSON, writeFile } from "@/utils/file";
import { useQuery } from "@tanstack/vue-query";
import { isEmpty } from "lodash";
import { useMessage } from "naive-ui";
import { effect, ref } from "vue";

export const gitmojis = ref<GitMoji[]>([]);
export const setGitMojis = (emojis: GitMoji[]) => {
    gitmojis.value = emojis;
};
export const getGitMojis = () => {
    const message = useMessage();
    return useQuery(
        ["gitmojis"],
        async () => {
            await sleep(1000);
            return apis.getGitMoji();
        },
        {
            select(data) {
                return data.gitmojis;
            },
            onSuccess(data) {
                setGitMojis(data);
            },
            onError() {
                message.error("加载 gitmoji 失败，使用已缓存的");
            },
            initialData: () => {
                return {
                    gitmojis: gitmojis.value,
                };
            },
            enabled: isEmpty(gitmojis.value),
        }
    );
};
readFileToJSON<GitMoji[]>("data/gitmojis.json")
    .then((res) => {
        setGitMojis(res);
    })
    .then(() => {
        effect(() => {
            writeFile("data/gitmojis.json", JSON.stringify(gitmojis.value));
        });
    });
