import { curRepoDir } from "@/store";
import { exists, readTextFile } from "@tauri-apps/api/fs";
import { runCommand } from "../command";

export const gitMergeAbort = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["merge", "--abort"], { cwd });
    return await command.exec();
};

export const readMergeMsg = (dir: Cwd = curRepoDir.value) => {
    return readTextFile(`${dir}/.git/MERGE_MSG`);
};

export const isMerge = (dir: Cwd = curRepoDir.value): Promise<boolean> => {
    return exists(`${dir}/.git/MERGE_HEAD`) as any;
};
