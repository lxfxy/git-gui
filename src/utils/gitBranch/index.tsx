import { curRepoDir, repoRemoteNames } from "@/store";
import { NAlert } from "naive-ui";
import { tw } from "twind";
import { commandErrorDialog, runCommand } from "../command";
import { dialog } from "../globalApis";

const formatMap = {
    authorname: "authorname",
    current: "HEAD",
    name: "refname:lstrip=1",
    authordate: "authordate",
    upstream: "upstream:lstrip=2",
};
const formatKeys = Object.keys(formatMap) as any as (keyof typeof formatMap)[];
const formatValues = Object.values(formatMap);
export type GitBranch = typeof formatMap & {
    remotes?: boolean;
    heads?: boolean;
    /**
     * remote 名字
     */
    remote?: string;
    /**
     * 不包含 remote 的名字
     */
    branchname: string;
};
export const gitBranch = async (cwd: Cwd = curRepoDir.value) => {
    const format = `${formatValues
        .map((item) => {
            return `%(${item})`;
        })
        .join("\n")}`;
    const command = runCommand("git", ["branch", "-a", "--format", format], {
        cwd,
    });
    const child = await command.spawn();
    return new Promise<[GitBranch, GitBranch[], GitBranch[], GitBranch[]]>(
        (resolve) => {
            let activeBranch: GitBranch;
            let chunks: string[][] = [];
            const branchs: GitBranch[] = [];
            const headsBranchs: GitBranch[] = [];
            const remotesBranchs: GitBranch[] = [];
            command.stdout.on("data", (line: string) => {
                const index = chunks.length % formatKeys.length;
                let key = formatKeys[index];
                let value = line.trim();
                chunks.push([key, value]);
                if (index + 1 === formatKeys.length) {
                    const branchInfo = Object.fromEntries(chunks) as GitBranch;
                    branchInfo.name = branchInfo.name.replace(
                        /^(\w+)\/(.+)/,
                        ($0, $1: "heads" | "remotes", $2) => {
                            branchInfo[$1] = true;
                            return $2;
                        }
                    );
                    if (branchInfo.remotes) {
                        branchInfo.remote = repoRemoteNames.value.find(
                            (item) => {
                                return branchInfo.name.startsWith(`${item}/`);
                            }
                        )!;
                        branchInfo.branchname = branchInfo.name.replace(
                            branchInfo.remote! + "/",
                            ""
                        );
                    } else {
                        branchInfo.branchname = branchInfo.name;
                    }
                    if (branchInfo.heads) {
                        headsBranchs.push(branchInfo);
                    } else if (branchInfo.remotes) {
                        remotesBranchs.push(branchInfo);
                    }
                    branchs.push(branchInfo);
                    if (branchInfo.current) {
                        activeBranch = branchInfo;
                    }
                    chunks = [];
                }
            });
            command.on("close", () => {
                resolve([activeBranch, branchs, headsBranchs, remotesBranchs]);
            });
        }
    );
};

export interface GitBranchDelOptions {
    cwd?: Cwd;
    branch: GitBranch;
    force?: boolean;
}
export const gitBranchDel = async ({
    cwd = curRepoDir.value,
    branch,
    force = false,
}: GitBranchDelOptions) => {
    const args = ["branch", "-d", branch.name];
    if (force) {
        args.push("-f");
    }
    if (branch.remotes) {
        args.push("-r");
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.execute();
};

export interface gitBranchCreateOptions {
    branchName: string;
    anchor?: string;
    cwd?: Cwd;
}
export const gitBranchCreate = async ({
    branchName,
    anchor,
    cwd = curRepoDir.value,
}: gitBranchCreateOptions) => {
    const args = ["branch", branchName];
    if (anchor) {
        args.push(anchor);
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

export interface GirBranchUpstreamOptions {
    /**
     * 本地分支名字
     */
    branchName: string;
    /**
     * 远程分支名，要带上远程仓库名字
     * 如: `origin/dev` `origin/master`
     */
    remoteBranchName: string;
    cwd?: Cwd;
}
export const girBranchUpstream = async ({
    branchName,
    remoteBranchName,
    cwd = curRepoDir.value,
}: GirBranchUpstreamOptions) => {
    const command = runCommand(
        "git",
        ["branch", "-u", remoteBranchName, branchName],
        { cwd }
    );
    command.on("command-error", commandErrorDialog);
    return command.exec();
};
export const createRemoteBranch = (
    branchname: string,
    remote: string
): GitBranch => {
    return {
        authordate: new Date().toString(),
        authorname: "",
        branchname,
        current: "",
        name: `${remote}/${branchname}`,
        upstream: "",
        remote: remote,
        remotes: true,
    };
};
export const createHeadsBranch = (
    branchname: string,
    upstream: string = "",
    current: string = ""
): GitBranch => {
    return {
        authordate: new Date().toString(),
        authorname: "",
        branchname,
        current,
        name: branchname,
        heads: true,
        upstream: upstream,
    };
};

export const branchDel = async (branch: GitBranch, force: boolean = false) => {
    dialog.value?.error({
        style: { width: "50vw" },
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick() {
            gitBranchDel({ branch, force });
        },
        title() {
            return (
                <div class={tw`ml-[6px]`}>
                    是否继续要{force ? "强制" : ""}删除分支
                    <code class={tw`mx-[6px]`}>{branch.name}</code>吗？
                </div>
            );
        },
        content() {
            return (
                <>
                    <NAlert type="info" bordered={false}>
                        不会影响远程仓库，只是本地仓库将不再有当前删除分支的信息。
                    </NAlert>
                </>
            );
        },
    });
};

export * from "./chooseBranch";
export * from "./FormItemRemoteBranch";
export * from "./addBranch";
