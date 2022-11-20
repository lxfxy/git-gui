import { curRepoDir } from "@/store";
import { commandErrorDialog, runCommand } from "../command";

export interface GitRebaseOptions {
    cwd?: Cwd;
    /**
     * Tag | Hash | branch
     */
    target: string;
    branch?: string;
}
export const gitRebase = async ({
    cwd = curRepoDir.value,
    target,
    branch,
}: GitRebaseOptions) => {
    const args = ["rebase", target];
    if (branch) {
        args.push(branch);
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    await command.exec();
};

export * from "./chooseBranchRebase";
