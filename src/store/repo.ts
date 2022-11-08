import { readFileToJSON, writeFile } from "@/utils/file";
import { open } from "@tauri-apps/api/dialog";
import { dirname } from "@tauri-apps/api/path";
import { effect, reactive, ref } from "vue";

export interface RepoInfo {
    dir: string;
    title: string;
}
export const repos = reactive<Record<string, RepoInfo>>({});
readFileToJSON("data/repos.json").then((res) => {
    Object.assign(repos, res);
});
effect(() => {
    writeFile("data/repos.json", JSON.stringify(repos));
});
export const curRepo = ref<RepoInfo | null>(null);
export const setCurRepo = (repoInfo: RepoInfo) => {
    curRepo.value = repoInfo;
};
export const getLocalRepo = async () => {
    const dirs = (await open({
        directory: true,
        multiple: true,
        title: "选择仓库",
    })) as string;
    for (let dir of dirs) {
        const dirName = dir.replace(await dirname(dir), "").slice(1);
        repos[dir] = {
            dir,
            title: dirName,
        };
    }
};
