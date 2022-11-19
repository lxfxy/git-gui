import { useRef } from "@/hooks";
import { getFilePathLastText, readFileToJSON, writeFile } from "@/utils";
// import { readFileToJSON, writeFile } from "@/utils/file";
import { open } from "@tauri-apps/api/dialog";
import { dirname } from "@tauri-apps/api/path";
import { isEmpty } from "lodash";
import { computed, effect, reactive, ref } from "vue";

export interface RepoInfo {
    dir: string;
    title: string;
    isCurrent?: boolean;
}
export const repos = reactive<Record<string, RepoInfo>>({});
export const curRepo = ref<RepoInfo>();
export const setCurRepo = (repoInfo: RepoInfo) => {
    if (curRepo.value) {
        curRepo.value.isCurrent = false;
    }
    curRepo.value = repoInfo;
    curRepo.value.isCurrent = true;
};
export const curRepoDir = computed(() => {
    return curRepo.value?.dir;
});
readFileToJSON<Record<string, RepoInfo>>("data/repos.json")
    .then((res) => {
        if (!isEmpty(res)) {
            Object.assign(repos, res);
            const repoValues = Object.values(res);
            setCurRepo(
                repoValues.find((item) => !!item.isCurrent) || repoValues[0]
            );
        }
    })
    .then(() => {
        effect(() => {
            writeFile("data/repos.json", JSON.stringify(repos));
        });
    });

export const getLocalRepo = async () => {
    const dirs = (await open({
        directory: true,
        multiple: true,
        title: "选择仓库",
    })) as string;
    for (let dir of dirs) {
        repos[dir] = {
            dir,
            title: getFilePathLastText(dir),
            isCurrent: false,
        };
    }
};

export const [contextmenuRepo, setContextmenuRepo] = useRef<RepoInfo>();
