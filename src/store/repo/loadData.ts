import { addArrayOnce, arrayToObj, readFileToJSON, writeFile } from "@/utils";
import { isEmpty } from "lodash";
import { effect } from "vue";
import { RepoInfo, repos, setCurRepo, defaultGroupName } from ".";
import { RepoGroup, repoGroups, setRepoCurGroup } from "./groups";
import { groupBy } from "lodash";

loadRepoData();
export async function loadRepoData() {
    const [reposData, repoGroupsData] = await Promise.all([
        readFileToJSON<Record<string, RepoInfo>>("data/repos.json"),
        readFileToJSON<RepoGroup[]>("data/repoGroups.json"),
    ]);
    if (!isEmpty(reposData)) {
        Object.assign(repos, reposData);
        const repoValues = Object.values(reposData);
        setCurRepo(
            repoValues.find((item) => !!item.isCurrent) || repoValues[0]
        );
    }
    const repoGroupsMap = arrayToObj(repoGroupsData, "name");
    repoGroupsMap[defaultGroupName] = repoGroupsMap[defaultGroupName] || {
        name: defaultGroupName,
        repos: [],
    };
    const defaultRepoGroup = repoGroupsMap[defaultGroupName];
    const map = Object.entries(reposData).reduce((memo, [key, value]) => {
        value.group = Array.isArray(value.group) ? value.group : [value.group];
        value.group?.forEach((item) => {
            memo[item] = memo[item] || [];
            const mapGroup = memo[item];
            mapGroup.push(value);
        });
        return memo;
    }, {} as Record<string, RepoInfo[]>);
    for (const [key, value] of Object.entries(map)) {
        const groupRepos = value.map((item) => item.dir);
        if (key === "undefined") {
            defaultRepoGroup.repos = groupRepos;
            value.forEach((item) => {
                item.group = [defaultGroupName];
            });
        } else if (!repoGroupsMap[key]) {
            repoGroupsMap[key] = {
                name: key,
                repos: groupRepos,
            };
        } else {
            repoGroupsMap[key].repos = groupRepos;
        }
    }
    repoGroups.value = repoGroupsData;
    setRepoCurGroup(repoGroupsMap[defaultGroupName]);
    effect(() => {
        writeFile("data/repoGroups.json", JSON.stringify(repoGroups.value));
    });
    effect(() => {
        Object.values(repos).forEach((item) => {
            item.group = item.group || [];
            const group = item.group;
            if (group.length === 0) {
                group.push(defaultGroupName);
            }
        });
        writeFile("data/repos.json", JSON.stringify(repos));
    });
}
