import { useRef } from "@/hooks";
import {
    GitBranch,
    gitBranch,
    gitSwitch,
    loop,
    repoChangeWatch,
    sleep,
} from "@/utils";
import { message } from "@/utils/globalApis";
import { isEmpty } from "lodash";
import { effect, reactive, ref } from "vue";
import { curRepoDir } from "./repo";
import { repoFileStatus, repoHistoryFileStatus } from "./repoFileStatus";

export const [contextmenuBranch, setContextmenuBranch] = useRef<GitBranch>();
export const repoBranchs = ref<GitBranch[]>([]);
export const repoHeadsBranchs = ref<GitBranch[]>([]);
export const repoRemotesBranchs = ref<GitBranch[]>([]);
export const curRepoBranch = ref<GitBranch>();
export const getBranch = async () => {
    if (curRepoDir.value) {
        let newCurBranch: GitBranch;
        [
            newCurBranch,
            repoBranchs.value,
            repoHeadsBranchs.value,
            repoRemotesBranchs.value,
        ] = await gitBranch();
        if (curRepoBranch.value?.name !== newCurBranch?.name) {
            curRepoBranch.value = newCurBranch;
        }
    }
};
// loop(getBranch);
repoChangeWatch(getBranch);
effect(getBranch);

export const changeBranch = async (branchInfo: GitBranch) => {
    if (
        !isEmpty(repoFileStatus.value) ||
        !isEmpty(repoHistoryFileStatus.value)
    ) {
        message.value?.error("当前工作树不是空的");
        return;
    }
    await gitSwitch(branchInfo.name);
    await getBranch();
};
