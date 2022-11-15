import { reactive, readonly } from "vue";

export interface RepoStatus {
    isPushing?: boolean;
    isRemoteRefetching?: boolean;
}
export const repoStatus = reactive<RepoStatus>({
    isPushing: false,
    isRemoteRefetching: false,
});
export const setRepoStatus = (newStatus: RepoStatus) => {
    Object.assign(repoStatus, newStatus);
};
