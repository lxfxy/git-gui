import { useContextmenu, useRef } from "@/hooks";
import { getFilePathLastText } from "@/utils";
// import { readFileToJSON, writeFile } from "@/utils/file";
import { open } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { computed, effect, reactive, ref, watch } from "vue";
import { addRepoGroupRepo, delRepoGroupRepo } from "./groups";

export const defaultGroupName = "默认分组";
export interface RepoInfo {
    dir: string;
    title: string;
    isCurrent?: boolean;
    group: string[];
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

listen<string[]>("tauri://file-drop", (e) => {
    addLocalRepo(e.payload);
});
export const addLocalRepo = (dirs: string[]) => {
    for (let dir of dirs) {
        if (repos[dir]) {
            continue;
        }
        repos[dir] = {
            dir,
            title: getFilePathLastText(dir),
            isCurrent: false,
            group: [defaultGroupName],
        };
        addRepoGroupRepo(defaultGroupName, [dir]);
    }
};
export const delLocalRepo = (dirs: string[]) => {
    for (const dir of dirs) {
        const repo = repos[dir];
        if (repo) {
            repo.group.forEach((group) => {
                delRepoGroupRepo(group, [repo.dir]);
            });
            delete repos[dir];
        }
    }
};

export const getLocalRepo = async () => {
    const dirs = (await open({
        directory: true,
        multiple: true,
        title: "选择仓库",
    })) as string[];
    addLocalRepo(dirs);
};

export const [contextmenuRepo, setContextmenuRepo] = useRef<RepoInfo>();
export const contextmenuScheduler = useContextmenu({
    clickoutside: true,
});

export * from "./groups";
export * from "./loadData";
