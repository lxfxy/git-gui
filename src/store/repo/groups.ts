import { useRef } from "@/hooks";
import { addArrayOnce, filterArrayItems } from "@/utils";
import { computed } from "vue";
import { RepoInfo, repos } from ".";

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
export const repoCurGroupRepos = computed(() => {
    const groupRepos = repoCurGroup.value?.repos || [];
    const result: Record<string, RepoInfo> = {};
    for (const groupReposDir of groupRepos) {
        if (repos[groupReposDir]) {
            result[groupReposDir] = repos[groupReposDir];
        }
    }
    return result;
});

export const repoGroupsName = computed(() => {
    return repoGroups.value?.map((item) => item.name) || [];
});
export const addRepoGroups = (name: string) => {
    if (repoGroupsName.value.includes(name)) {
        return;
    }
    const newGroup = {
        name,
        repos: [],
    };
    repoGroups.value?.push(newGroup);
    return newGroup;
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
export const addRepoGroupRepo = (groupName: string, repoDirs: string[]) => {
    const group = getRepoGroup(groupName);
    addArrayOnce(group!.repos, ...repoDirs);
};
export const delRepoGroupRepo = (groupName: string, repoDirs: string[]) => {
    const group = getRepoGroup(groupName);
    group!.repos = filterArrayItems(group!.repos, ...repoDirs);
};
export const getRepoGroup = (groupName: string) => {
    return repoGroups.value!.find((group) => {
        return group.name === groupName;
    });
};
