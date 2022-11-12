import { curRepoDir } from "@/store";
import { runCommand } from "./command";

export const gitSwitch = async (
    branch: string,
    cwd: Cwd = curRepoDir.value
) => {
    const command = runCommand("git", ["switch", branch], { cwd });
    return await command.execute();
};
