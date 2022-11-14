import { GitBranch, gitBranch, loop, sleep } from "@/utils";
import { effect, reactive, ref } from "vue";
import { curRepoDir } from "./repo";

export const repoBranchs = ref<GitBranch[]>([]);
export const curRepoBranch = ref<GitBranch>();
export const getBranch = async () => {
    if (curRepoDir.value) {
        [curRepoBranch.value, repoBranchs.value] = await gitBranch();
    }
};
loop(getBranch);
effect(getBranch);
