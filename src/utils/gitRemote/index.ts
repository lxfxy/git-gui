import {
    curRepoDir,
    setRepoStatus,
    repoHeadsBranchs,
    repoRemoteNames,
    repoRemotesBranchs,
} from "@/store";
import { sleep } from "..";
import { runCommand, commandErrorDialog } from "../command";

export interface GitRemoteUrl {
    url: string;
    name: string;
    type: string;
}
export interface GitRemote {
    name: string;
    fetch: GitRemoteUrl;
    push: GitRemoteUrl;
    urls: GitRemoteUrl[];
}
export const gitRemote = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "-v"], { cwd });
    await command.spawn();
    return new Promise<Record<string, GitRemote>>((resolve) => {
        const result: Record<string, GitRemote> = {};
        command.stdout.on("data", (remoteInfo) => {
            const [, name, url, type] = /(.+?)\s+(.+?)\s\((\w+)\)/.exec(
                remoteInfo
            )!;
            const info = {
                name,
                url,
                type,
            };
            result[name] = result[name] || { name, urls: [] };
            result[name][type as "fetch" | "push"] = info;
            result[name].urls.push(info);
        });
        command.on("close", () => {
            resolve(result);
        });
    });
};

export const gitRemoteUpdate = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "update"], { cwd });
    const status: Record<string, boolean> = {};
    for (const remoteBranch of repoRemotesBranchs.value) {
        status[remoteBranch.name] = true;
    }
    setRepoStatus({ isRemoteRefetching: status });
    const child = await command.exec().finally(() => {
        for (const remoteBranch of repoRemotesBranchs.value) {
            status[remoteBranch.name] = false;
        }
        setRepoStatus({ isRemoteRefetching: status });
    });
    // const newRemotes = await gitRemote();
    // const curHeadsBranchs = repoHeadsBranchs.value;
    // for (const remoteBranch of repoRemotesBranchs.value) {
    //     if (remoteBranch.branchname === "HEAD") {
    //         continue;
    //     }
    //     const isExits = curHeadsBranchs.find((item) => {
    //         return item.branchname === remoteBranch.branchname;
    //     });
    //     if (isExits) {
    //     } else {
    //         await gitBranchCreate({
    //             branchName: remoteBranch.branchname,
    //             anchor: remoteBranch.name,
    //         });
    //     }
    // }
};

interface GitRemoteDelOptions {
    cwd?: Cwd;
    remoteName: string;
}
export const gitRemoteDel = async ({
    cwd,
    remoteName,
}: GitRemoteDelOptions) => {
    const command = runCommand("git", ["remote", "remove", remoteName], {
        cwd,
    });
    command.on("command-error", commandErrorDialog);
    await command.exec();
};

export interface GitRemoteAddOptions {
    cwd?: Cwd;
    name: string;
    url: string;
}
export const gitRemoteAdd = async ({
    cwd = curRepoDir.value,
    name,
    url,
}: GitRemoteAddOptions) => {
    const command = runCommand("git", ["remote", "add", name, url], { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

export interface GitRemoteRename {
    cwd?: Cwd;
    remoteName: string;
    newRemoteName: string;
}
export const gitRemoteRename = async ({
    cwd = curRepoDir.value,
    newRemoteName,
    remoteName,
}: GitRemoteRename) => {
    const command = runCommand(
        "git",
        ["remote", "rename", remoteName, newRemoteName],
        { cwd }
    );
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

export interface GitRemoteSetUrl {
    cwd?: Cwd;
    remoteName: string;
    url: string;
}
export const gitRemoteSetUrl = async ({
    remoteName,
    url,
    cwd = curRepoDir.value,
}: GitRemoteSetUrl) => {
    const command = runCommand("git", ["remote", "set-url", remoteName, url], {
        cwd,
    });
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

export * from "./AddRemote";
export * from "./DelRemote";
