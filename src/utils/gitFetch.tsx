import { curRepoDir } from "@/store";
import { commandErrorDialog, runCommand } from "./command";
import { GitBranch } from ".";

interface GitFetchOptions {
    cwd?: Cwd;
    remoteBranch: GitBranch;
}
export const gitFetch = ({
    cwd = curRepoDir.value,
    remoteBranch,
}: GitFetchOptions) => {
    const command = runCommand(
        "git",
        ["fetch", remoteBranch.remote!, remoteBranch.branchname],
        { cwd }
    );
    command.on("command-error", commandErrorDialog);
    return command.exec();
};
