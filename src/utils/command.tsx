import { EventEmitter } from "@tauri-apps/api/shell";
import { ChildProcess, Command, SpawnOptions } from "@tauri-apps/api/shell";
import { tw } from "twind";
import { dialog } from "./globalApis";
export type CommandEvent = "command-error" | "command-success";
export interface CommandEventData {
    shell: string;
    args: string[];
    options: RunCommandOptions;
    progress: ChildProcess;
    stderrLines: string[];
    stdoutLines: string[];
}
export type CommandEventListener = (
    event: CommandEvent,
    listener: (data: CommandEventData) => void
) => CustomCommand;
export type CustomCommand = Command & {
    addListener: CommandEventListener;
    removeListener: CommandEventListener;
    on: CommandEventListener;
    once: CommandEventListener;
    off: CommandEventListener;
    prependListener: CommandEventListener;
    prependOnceListener: CommandEventListener;
    emit(name: CommandEvent, data: CommandEventData): CustomCommand;
};
export interface RunCommandOptions extends SpawnOptions {
    // showStdout?: boolean;
}
export const runCommand = (
    shell: string,
    args: string[] = [],
    { ...options }: RunCommandOptions = {}
) => {
    const command = new Command(shell, args, {
        ...options,
    }) as CustomCommand;
    const stderrLines: string[] = [];
    const stdoutLines: string[] = [];
    command.stderr.on("data", (error) => {
        stderrLines.push(error);
    });
    command.stdout.on("data", (output) => {
        stdoutLines.push(output);
    });
    command.addListener("command-error", (e) => {});
    const execute = command.execute.bind(command);
    command.execute = async () => {
        const child = await execute();
        const eventData: CommandEventData = {
            shell,
            args,
            options,
            progress: child,
            stderrLines,
            stdoutLines,
        };
        if (child.code === 0) {
            command.emit("command-success", eventData);
        } else if (child.code !== 0) {
            command.emit("command-error", eventData);
        }
        return child;
    };
    return command;
};

export const commandSuccessDialog = ({
    shell,
    args,
    progress,
}: CommandEventData) => {
    dialog.value?.success({
        style: { width: "50vw" },
        maskClosable: true,
        positiveText: "知道了",
        title() {
            return (
                <code class={tw`ml-[10px]`}>
                    {shell} {args?.join(" ")}
                </code>
            );
        },
        content() {
            return (
                <>
                    <code>{progress.stderr}</code>
                </>
            );
        },
    });
};

export const commandErrorDialog = ({
    stderrLines,
    shell,
    args,
}: CommandEventData) => {
    dialog.value?.error({
        style: { width: "50vw" },
        maskClosable: false,
        positiveText: "知道了",
        title() {
            return (
                <code class={tw`ml-[10px]`}>
                    {shell} {args?.join(" ")}
                </code>
            );
        },
        content() {
            return (
                <>
                    {stderrLines.map((item) => {
                        return (
                            <code key={item} class={tw`block`}>
                                {item}
                            </code>
                        );
                    })}
                </>
            );
        },
    });
};
