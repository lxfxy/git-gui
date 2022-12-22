import { curRepoDir } from "@/store";
import { exists, readTextFile } from "@tauri-apps/api/fs";
import { commandErrorDialog, runCommand } from "../command";
import { isExists } from "../file";

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

export const gitRebaseAbort = async (cwd: string = curRepoDir.value!) => {
    const command = runCommand("git", ["rebase", "--abort"], { cwd });
    return await command.exec();
};

export const gitRebaseSkip = async (cwd: string = curRepoDir.value!) => {
    const command = runCommand("git", ["rebase", "--skip"], { cwd });
    return await command.exec();
};

export const gitRebaseContinue = async (cwd: string = curRepoDir.value!) => {
    const command = runCommand("git", ["rebase", "--continue"], { cwd });
    return await command.exec();
};

export const isRebaseMerge = (): Promise<boolean> => {
    return exists(`${curRepoDir.value}/.git/REBASE_HEAD`) as any;
};

export const readRebaseMergeMsg = async (repoDir: string) => {
    const dir = `${repoDir}/.git/rebase-merge`;
    return {
        end: parseInt(await readTextFile(`${dir}/end`)),
        num: parseInt(await readTextFile(`${dir}/msgnum`)),
        message: await readTextFile(`${dir}/message`),
    };
};

export * from "./chooseBranchRebase";
