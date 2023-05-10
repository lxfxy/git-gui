import { ChildProcess, Command, SpawnOptions } from "@tauri-apps/api/shell";
import { ref } from "vue";
import { dialog } from "./globalApis";
export type CommandEvent = "command-error" | "command-success";
export interface CommandEventData {
    shell: string;
    args: string[];
    options: RunCommandOptions;
    progress: ChildProcess;
    stderrLines: string[];
    stdoutLines: string[];
    command: Command;
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
    exec(): Promise<CommandEventData>;
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
    const promiseCatch = (reason: any) => {
        stderrLines.push(reason);
        return {
            code: 1,
            signal: null,
            stderr: reason,
            stdout: "",
        } as ChildProcess;
    };
    const execute = command.execute.bind(command);
    command.execute = async () => {
        const child = await execute().catch(promiseCatch);
        const eventData: CommandEventData = {
            shell,
            args,
            options,
            progress: child,
            stderrLines,
            stdoutLines,
            command,
        };
        if (child.code === 0) {
            command.emit("command-success", eventData);
        } else {
            command.emit("command-error", eventData);
        }
        return child;
    };
    command.exec = async () => {
        const child = await execute().catch(promiseCatch);
        const eventData: CommandEventData = {
            shell,
            args,
            options,
            progress: child,
            stderrLines,
            stdoutLines,
            command,
        };

        if (child.code === 0) {
            command.emit("command-success", eventData);
            return Promise.resolve(eventData);
        } else {
            command.emit("command-error", eventData);
            return Promise.reject(eventData);
        }
    };
    const spawn = command.spawn.bind(command);
    command.spawn = async () => {
        const child = await spawn();
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
                <code class={`ml-[10px]`}>
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
    options,
}: CommandEventData) => {
    dialog.value?.error({
        style: { width: "50vw" },
        maskClosable: false,
        positiveText: "知道了",
        title() {
            return (
                <code class={`ml-[10px]`}>
                    {shell} {args?.join(" ")}
                </code>
            );
        },
        content() {
            return (
                <>
                    <code class={`mb-[6px]`}>{options.cwd}</code>
                    {stderrLines?.map((item) => {
                        return (
                            <code key={item} class={`block`}>
                                {item}
                            </code>
                        );
                    })}
                </>
            );
        },
    });
};

export const showNotify = ref(true);
