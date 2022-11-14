import { curRepoDir, setRepoStatus } from "@/store";
import { tw } from "twind";
import { commandErrorDialog, CommandEventData, runCommand } from "./command";
import { chooseBranch, GitBranch } from "./gitBranch";
import { dialog } from "./globalApis";

export interface GitPushOptions {
    cwd?: Cwd;
    remote?: GitBranch;
    branch: GitBranch;
}
export const gitPush = async ({
    cwd = curRepoDir.value,
    branch,
    remote,
}: GitPushOptions) => {
    const args = ["push"];
    if (!branch.upstream && !remote) {
        const info = await chooseBranch({ branch: branch.name });
        if (info.isUpstream) {
            return await gitPushUpstream({ remote: info.branch, branch });
        } else {
            remote = info.branch;
        }
    }
    if (remote) {
        args.push(remote.remote!, `${branch.branchname}:${remote.branchname}`);
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", (e) => {
        gitPushErrorForceDialog(e, args.slice(1));
    });
    setRepoStatus({ isPushing: true });
    return await command.execute().finally(() => {
        setRepoStatus({ isPushing: false });
    });
};

export interface GitPushUpstreamOptions {
    cwd?: Cwd;
    branch: GitBranch;
    remote: GitBranch;
}
export const gitPushUpstream = async ({
    cwd,
    branch,
    remote,
}: GitPushUpstreamOptions) => {
    const args = [
        "push",
        remote.remote!,
        `${branch.branchname}:${remote.branchname}`,
        "-u",
    ];
    const command = runCommand("git", args, { cwd });
    setRepoStatus({ isPushing: true });
    command.on("command-error", (e) => {
        gitPushErrorForceDialog(e, args.slice(1));
    });
    return await command.execute().finally(() => {
        setRepoStatus({ isPushing: false });
    });
};

export interface GitPushForce {
    cwd?: Cwd;
    args: string[];
}
export const gitPushForce = async ({
    args,
    cwd = curRepoDir.value,
}: GitPushForce) => {
    const command = runCommand("git", ["push", ...args, "-f"], { cwd });
    command.on("command-error", commandErrorDialog);
    setRepoStatus({ isPushing: true });
    return await command.execute().finally(() => {
        setRepoStatus({ isPushing: false });
    });
};

export const gitPushErrorForceDialog = (
    { shell, args, stderrLines }: CommandEventData,
    forceArgs: string[]
) => {
    dialog.value?.error({
        style: { width: "50vw" },
        maskClosable: false,
        positiveText: "知道了",
        negativeText: "强制推送",
        onNegativeClick() {
            gitPushForce({ args: forceArgs });
        },
        title() {
            return (
                <code class={tw`ml-[4px]`}>
                    {shell} {args.join(" ")}
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
