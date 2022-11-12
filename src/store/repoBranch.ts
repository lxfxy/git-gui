import { GitBranch, gitBranch, loop, sleep } from "@/utils";
import { effect, reactive, ref } from "vue";
import { curRepoDir } from "./repo";

export const branchs = ref<GitBranch[]>([]);
export const curBranch = ref<GitBranch>();
export const getBranch = async () => {
    if (curRepoDir.value) {
        [curBranch.value, branchs.value] = await gitBranch();
    }
};
loop(getBranch);
effect(getBranch);
