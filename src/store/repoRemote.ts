import { loop, gitRemote, GitRemote, GitRemotes } from "@/utils";
// import { gitRemote, GitRemote } from "@/utils";
import { effect, reactive, ref } from "vue";
import { curRepoDir, repos } from "./repo";

export const repoRemotes = ref<Record<string, GitRemotes>>({});
export const repoRemoteNames = ref<string[]>([]);
export const getRemotes = async () => {
    if (curRepoDir.value) {
        const remotes = await gitRemote();
        repoRemotes.value = remotes;
        repoRemoteNames.value = Object.keys(remotes);
    }
};
loop(getRemotes);
effect(getRemotes);
export const allRemotes = ref<Record<string, Record<string, GitRemotes>>>({});
export const getAllRemotes = async () => {
    const dirs = Object.keys(repos);
    const result: any = {};
    for (const dir of dirs) {
        result[dir] = await gitRemote(dir);
    }
    allRemotes.value = result;
};
loop(getAllRemotes);
effect(getAllRemotes);
