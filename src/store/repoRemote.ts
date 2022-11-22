import { useRef } from "@/hooks";
import {
    loop,
    gitRemote,
    GitRemote,
    GitRemoteUrl,
    repoChangeWatch,
} from "@/utils";
import { effect, reactive, ref } from "vue";
import { curRepoDir, repos } from "./repo";

export const repoRemotes = ref<Record<string, GitRemote>>({});
export const repoRemoteNames = ref<string[]>([]);
export const getRemotes = async () => {
    if (curRepoDir.value) {
        const remotes = await gitRemote();
        repoRemotes.value = remotes;
        repoRemoteNames.value = Object.keys(remotes);
    }
};
// loop(getRemotes);
repoChangeWatch(getRemotes);
effect(getRemotes);

export const allRemotes = ref<Record<string, Record<string, GitRemote>>>({});
export const getAllRemotes = async () => {
    const dirs = Object.keys(repos);
    const result: any = {};
    for (const dir of dirs) {
        result[dir] = await gitRemote(dir);
    }
    allRemotes.value = result;
};
// loop(getAllRemotes);
repoChangeWatch(getAllRemotes);
effect(getAllRemotes);

export const [contextmenuRemote, setContextmenuRemote] = useRef<GitRemote>();
