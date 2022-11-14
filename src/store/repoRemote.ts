import { loop, gitRemote, GitRemote, GitRemotes } from "@/utils";
// import { gitRemote, GitRemote } from "@/utils";
import { effect, reactive, ref } from "vue";
import { curRepoDir } from "./repo";

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
