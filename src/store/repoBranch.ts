import { useRef } from "@/hooks";
import {
    GitBranch,
    gitBranch,
    gitSwitch,
    loop,
    repoChangeWatch,
    showNotify,
    sleep,
} from "@/utils";
import { message } from "@/utils/globalApis";
import { isEmpty } from "lodash";
import { effect, reactive, ref, watch } from "vue";
import { curRepoDir } from "./repo";
import { repoFileStatus, repoHistoryFileStatus } from "./repoFileStatus";
import { repoRemotes } from "./repoRemote";
import { repoStatus } from "./repoStatus";

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
watch(() => [curRepoDir.value, repoRemotes.value], getBranch, {
    immediate: true,
});

export const changeBranch = async (branchInfo: GitBranch) => {
    if (repoStatus.isRebaseMerge) {
        message.value?.error(
            "当前正在处理变基冲突，不能切换分支。可以退出变基后，再进行切换分支",
            { keepAliveOnHover: true }
        );
        return;
    }
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

export const getUpstreamBranch = (branch: GitBranch) => {
    if (branch.remotes) {
        return branch;
    }
    if (!branch.upstream) {
        console.error(branch, `此分支没有关联上游分支`);
        return;
    }
    const upstream = branch.upstream;
    return repoBranchs.value.find((item) => {
        return item.name === upstream;
    });
};
