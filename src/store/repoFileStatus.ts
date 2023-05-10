import { useRef } from "@/hooks";
import { FileStatus, getRepoFileStatus, loop, RepoWorkTree } from "@/utils";
import { computed, ref } from "vue";
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
loop(readRepoFilesStatus);
// repoChangeWatch(readRepoFilesStatus);
// effect(readRepoFilesStatus);

export const [fileStatusWorkspace, setFileStatusWorkspace] =
    useRef<RepoWorkTree>(RepoWorkTree.Workspace);

export const fileStatusIsWorkSpace = computed(() => {
    return fileStatusWorkspace.value === RepoWorkTree.Workspace;
});

export const fileStatusIsHistory = computed(() => {
    return fileStatusWorkspace.value === RepoWorkTree.History;
});
