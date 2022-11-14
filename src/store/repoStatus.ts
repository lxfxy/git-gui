import { reactive, readonly } from "vue";

export interface RepoStatus {
    isPushing: boolean;
}
export const repoStatus = reactive<RepoStatus>({
    isPushing: false,
});
export const setRepoStatus = (newStatus: RepoStatus) => {
    Object.assign(repoStatus, newStatus);
};
