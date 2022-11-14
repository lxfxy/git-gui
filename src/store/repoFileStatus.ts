import {
    loop,
    sleep,
    FileStatus,
    getRepoFileStatus,
    RepoWorkTree,
} from "@/utils";
// import { FileStatus, getRepoFileStatus, RepoWorkTree } from "@/utils/gitStatus";
import { effect, ref } from "vue";
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
effect(readRepoFilesStatus);
