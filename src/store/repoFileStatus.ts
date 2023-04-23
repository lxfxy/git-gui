import { useRef } from "@/hooks";
import {
    loop,
    sleep,
    FileStatus,
    getRepoFileStatus,
    RepoWorkTree,
    repoChangeWatch,
} from "@/utils";
// import { FileStatus, getRepoFileStatus, RepoWorkTree } from "@/utils/gitStatus";
import { computed, effect, ref } from "vue";
import { curRepo } from "./repo";

export const repoFileStatus = ref<FileStatus[]>([]);
export const repoHistoryFileStatus = ref<FileStatus[]>([]);

export const repoWorkTreeInfo = {
    [RepoWorkTree.History]: repoHistoryFileStatus,
    [RepoWorkTree.Workspace]: repoFileStatus,
};
const readRepoFilesStatus = async () => {
    if (curRepo.value) {
        [repoFileStatus.value, repoHistoryFileStatus.value] =
            await getRepoFileStatus();
    }
};
// loop(readRepoFilesStatus);
repoChangeWatch(readRepoFilesStatus);
// effect(readRepoFilesStatus);

export const [fileStatusWorkspace, setFileStatusWorkspace] =
    useRef<RepoWorkTree>(RepoWorkTree.Workspace);

export const fileStatusIsWorkSpace = computed(() => {
    return fileStatusWorkspace.value === RepoWorkTree.Workspace;
});

export const fileStatusIsHistory = computed(() => {
    return fileStatusWorkspace.value === RepoWorkTree.History;
});
