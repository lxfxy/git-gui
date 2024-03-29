import { curRepoDir, repoBranchs, setRepoStatus } from "@/store";
import { tw } from "@twind/core";
import { commandErrorDialog, CommandEventData, runCommand } from "./command";
import { chooseBranch, GitBranch } from "./gitBranch";
import { dialog } from "./globalApis";

export interface GitPushOptions {
    cwd?: Cwd;
    remote?: GitBranch;
    branch: GitBranch;
    force?: boolean;
    chooseBranchs?: boolean;
}
export const gitPush = async ({
    cwd = curRepoDir.value,
    branch,
    remote,
    force = false,
    chooseBranchs = false,
}: GitPushOptions) => {
    const args = ["push"];
    if (force) {
        args.push("-f");
    }
    if (chooseBranchs || (!branch.upstream && !remote)) {
        const info = await chooseBranch({
            branch: branch.name,
            showInfo: !branch.upstream,
            force,
        });
        if (info.isUpstream) {
            return await gitPushUpstream({
                remote: info.branch,
                branch,
                force,
            });
        } else {
            remote = info.branch;
        }
    }
    if (!remote) {
        remote = repoBranchs.value.find((item) => {
            return item.remotes && item.name === branch.upstream;
        })!;
    }
    args.push(remote.remote!, `${branch.branchname}:${remote.branchname}`);
    const command = runCommand("git", args, { cwd });
    // command.on("command-error", (e) => {
    //     gitPushErrorForceDialog(e, args.slice(1));
    // });
    command.on("command-error", commandErrorDialog);
    setRepoStatus({
        isPushing: {
            [branch.branchname]: true,
        },
        pushingMsg: {
            [branch.branchname]: {
                remoteName: remote.name,
            },
        },
    });
    return await command.execute().finally(() => {
        setRepoStatus({
            isPushing: {
                [branch.branchname]: false,
            },
        });
    });
};

export interface GitPushUpstreamOptions {
    cwd?: Cwd;
    branch: GitBranch;
    remote: GitBranch;
    force?: boolean;
}
export const gitPushUpstream = async ({
    cwd = curRepoDir.value,
    branch,
    remote,
    force,
}: GitPushUpstreamOptions) => {
    const args = [
        "push",
        "-u",
        `${remote.remote!}`,
        `${branch.branchname}:${remote.branchname}`,
    ];
    if (force) {
        args.push("-f");
    }
    const command = runCommand("git", args, { cwd });
    setRepoStatus({
        isPushing: {
            [branch.branchname]: true,
        },
        pushingMsg: {
            [branch.branchname]: {
                remoteName: remote.name,
            },
        },
    });
    // command.on("command-error", (e) => {
    //     gitPushErrorForceDialog(e, args.slice(1));
    // });
    command.on("command-error", commandErrorDialog);
    return await command.execute().finally(() => {
        setRepoStatus({
            isPushing: {
                [branch.branchname]: false,
            },
        });
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
        title() {
            return (
                <code class={`ml-[4px]`}>
                    {shell} {args.join(" ")}
                </code>
            );
        },
        content() {
            return (
                <>
                    {stderrLines.map((item) => {
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
