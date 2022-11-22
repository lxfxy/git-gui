import { commandErrorDialog, runCommand } from "../command";

export interface GitCloneOptions {
    cwd?: Cwd;
    name?: string;
    repoUrl: string;
}
export const gitClone = async ({ repoUrl, cwd, name }: GitCloneOptions) => {
    const args: string[] = ["clone", repoUrl];
    if (name) {
        args.push(name);
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

export * from "./Clone";
