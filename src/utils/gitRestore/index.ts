import { curRepoDir } from "@/store";
import { runCommand } from "../command";
import { FileStatus } from "../gitStatus";

export interface GitRestoreOptions {
    cwd?: Cwd;
    file: FileStatus;
    workspace?: boolean;
    staged?: boolean;
}
export const gitRestore = async ({
    cwd = curRepoDir.value,
    file,
    workspace,
    staged,
}: GitRestoreOptions) => {
    const args = ["restore", file.filepath];
    if (workspace) {
        args.push("-W");
    }
    if (staged) {
        args.push("-S");
    }
    const command = runCommand("git", args, {
        cwd,
    });
    return command.exec();
};
