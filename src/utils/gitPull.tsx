import { curRepoDir } from "@/store";
import { commandErrorDialog, runCommand } from "./command";

interface GitPull {
    cwd?: Cwd;
    rebase?: boolean;
    remote: string;
    remoteBranchName: string;
}
export const gitPull = async ({
    cwd = curRepoDir.value,
    remote,
    remoteBranchName,
    rebase = false,
}: GitPull) => {
    const args = ["pull", remote, remoteBranchName];
    if (rebase) {
        args.push("--rebase");
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    await command.exec();
};
