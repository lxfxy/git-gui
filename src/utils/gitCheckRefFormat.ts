import { curRepoDir } from "@/store";
import { CommandEventData, runCommand } from "./command";

interface GitCheckRefFormatOptions {
    cwd?: Cwd;
    branchName: string;
}
export const gitCheckRefFormat = ({
    cwd = curRepoDir.value,
    branchName,
}: GitCheckRefFormatOptions) => {
    const command = runCommand(
        "git",
        ["check-ref-format", "--normalize", branchName],
        {
            cwd,
        }
    );
    return new Promise<CommandEventData>(async (resolve, reject) => {
        try {
            command.on("command-success", resolve);
            command.on("command-error", reject);
            await command.execute();
        } catch (error) {
            reject();
        }
    });
};
