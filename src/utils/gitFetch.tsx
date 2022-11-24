import { curRepoDir, repoStatus, setRepoStatus } from "@/store";
import { commandErrorDialog, runCommand } from "./command";
import { GitBranch } from ".";

interface GitFetchOptions {
    cwd?: Cwd;
    remoteBranch: GitBranch;
}
export const gitFetch = async ({
    cwd = curRepoDir.value,
    remoteBranch,
}: GitFetchOptions) => {
    const command = runCommand(
        "git",
        ["fetch", remoteBranch.remote!, remoteBranch.branchname],
        { cwd }
    );
    setRepoStatus({
        isRemoteRefetching: {
            [remoteBranch.name]: true,
        },
    });
    console.log(repoStatus);

    command.on("command-error", commandErrorDialog);
    return await command.exec().finally(() => {
        setRepoStatus({
            isRemoteRefetching: {
                [remoteBranch.name]: false,
            },
        });
    });
};
