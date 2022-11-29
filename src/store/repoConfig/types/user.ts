import { RecordAddPrefix } from ".";

export interface RepoConfigUserCfgs {
    email: string;
    name: string;
}
export type RepoConfigUser = RecordAddPrefix<"user", RepoConfigUserCfgs>;
