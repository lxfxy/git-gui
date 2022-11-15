import { curRepoDir, setRepoStatus } from "@/store";
import { runCommand } from "./command";

export interface GitRemote {
    url: string;
    name: string;
}
export interface GitRemotes {
    name: string;
    fetch: GitRemote;
    push: GitRemote;
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
            result[name] = result[name] || { name };
            result[name][type as "fetch" | "push"] = {
                name,
                url,
            };
        });
        command.on("close", () => {
            resolve(result);
        });
    });
};

export const gitRemoteUpdate = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "update"], { cwd });
    setRepoStatus({ isRemoteRefetching: true });
    return await command.execute().finally(() => {
        setRepoStatus({ isRemoteRefetching: false });
    });
};
