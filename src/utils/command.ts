import { Command, SpawnOptions } from "@tauri-apps/api/shell";

export const runCommand = (
    shell: string,
    args?: string[],
    options?: SpawnOptions
) => {
    const command = new Command(shell, args, options);
    command.on("error", (err) => {
        console.log(err);
    });
    return command;
};
