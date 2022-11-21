import {
    curRepoDir,
    getRemotes,
    repoHeadsBranchs,
    repoRemotesBranchs,
    setRepoStatus,
} from "@/store";
import { runCommand } from "./command";
import { gitBranchCreate } from "./gitBranch";

export interface GitRemote {
    url: string;
    name: string;
    type: string;
}
export interface GitRemotes {
    name: string;
    fetch: GitRemote;
    push: GitRemote;
    urls: GitRemote[];
}
export const gitRemote = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "-v"], { cwd });
    await command.spawn();
    return new Promise<Record<string, GitRemotes>>((resolve) => {
        const result: Record<string, GitRemotes> = {};
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
    setRepoStatus({ isRemoteRefetching: true });
    const child = await command.execute();
    const newRemotes = await gitRemote();
    const curHeadsBranchs = repoHeadsBranchs.value;
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
    setRepoStatus({ isRemoteRefetching: false });
};
