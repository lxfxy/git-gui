import { curRepoDir, setRepoStatus } from "@/store";
import { commandErrorDialog, runCommand } from "./command";
import { GitBranch } from "./gitBranch.bak";

interface GitPull {
    cwd?: Cwd;
    rebase?: boolean;
    remote: GitBranch;
}
export const gitPull = async ({
    cwd = curRepoDir.value,
    remote,
    rebase = false,
}: GitPull) => {
    const args = ["pull", remote.remote!, remote.branchname];
    if (rebase) {
        args.push("--rebase");
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    setRepoStatus({
        isRemoteRefetching: {
            [remote.name]: true,
        },
    });
    return await command.exec().finally(() => {
        setRepoStatus({
            isRemoteRefetching: {
                [remote.name]: false,
            },
        });
    });
};
