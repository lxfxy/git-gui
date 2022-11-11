import { sleep } from "@/utils";
import { FileStatus, getRepoFileStatus, RepoWorkTree } from "@/utils/gitStatus";
import { ref } from "vue";
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
    await sleep(600);
    requestIdleCallback(readRepoFilesStatus);
};
requestIdleCallback(readRepoFilesStatus);
