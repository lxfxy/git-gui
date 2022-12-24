import { useRef } from "@/hooks";
import {
    getFilePathLastText,
    readFile,
    readFileToJSON,
    runCommand,
    sleep,
    writeFile,
} from "@/utils";
// import { readFileToJSON, writeFile } from "@/utils/file";
import { open } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";
import { readTextFile } from "@tauri-apps/api/fs";
import { BaseDirectory, dirname } from "@tauri-apps/api/path";
import axios from "axios";
import { isEmpty } from "lodash";
import { computed, effect, reactive, ref } from "vue";

export interface RepoInfo {
    dir: string;
    title: string;
    isCurrent?: boolean;
    group?: string;
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
        };
    }
};
export const delLocalRepo = (dirs: string[]) => {
    for (const dir of dirs) {
        if (repos[dir]) {
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

export const [contextmenuRepo, setContextmenuRepo] = useRef<RepoInfo>();

export interface RepoGroup {
    name: string;
    repos: string[];
}
export const [repoGroups, setRepoGroups] = useRef<RepoGroup[]>([
    {
        name: "默认分组",
        repos: [],
    },
]);
export const [repoCurGroup, setRepoCurGroup] = useRef<RepoGroup>();
readFileToJSON<RepoGroup[]>("data/repoGroups.json")
    .then((res) => {
        repoGroups.value = res;
    })
    .then(() => {
        effect(() => {
            writeFile("data/repoGroups.json", JSON.stringify(repoGroups.value));
        });
    });
export const repoGroupsName = computed(() => {
    return repoGroups.value?.map((item) => item.name) || [];
});
export const addRepoGroups = (name: string) => {
    if (repoGroupsName.value.includes(name)) {
        return;
    }
    repoGroups.value?.push({
        name,
        repos: [],
    });
    repoGroups.value = [...repoGroups.value!];
};
export const removeRepoGroups = (name: string) => {
    repoGroups.value = repoGroups.value?.filter((item) => {
        return item.name !== name;
    });
};
export const changeRepoGroupName = (oldName: string, newName: string) => {
    const repoGroup = repoGroups.value?.find((item) => {
        return item.name === oldName;
    });
    repoGroup!.name = newName;
};
