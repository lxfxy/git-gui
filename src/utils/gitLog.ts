import { curRepoDir } from "@/store";
import { runCommand } from "./command";

// git log -1 --format='Hash: %H%nRefs: %D%nAuthor: %an%nDate: %aI%n%B'

const format1 = [
    `Hash: %H`,
    `Parent: %P`,
    `Ref: %D`,
    `Author: %an`,
    `Date: %aI`,
];
const format2Map = {
    Hash: `H`,
    Parent: `P`,
    Ref: `D`,
    Author: `an`,
    Date: `ai`,
    Subject: `s`,
    Timestamp: `at`,
    Commiter: `cn`,
    Tree: "T",
};
const format2 = Object.values(format2Map).map((item) => `%${item}`);
const format2Names = Object.keys(format2Map);
export interface GetGitLogOptions {
    // limit?: number;
    // startHash?: string;
    cwd?: string;
    args?: string[];
}
export type GitLog = typeof format2Map & {
    Message: string;
    paths: string[];
};
export const gitLog = async ({
    cwd = curRepoDir.value,
    args = [],
}: GetGitLogOptions = {}) => {
    if (!cwd) {
        return [];
    }
    const maxIndex = format2.length;
    const lines: string[] = [];
    const command = runCommand(
        "git",
        ["log", `--format=${format2.join("%n")}`, ...args],
        { cwd }
    );
    let chunks: string[][] = [];
    const result: GitLog[] = [];
    command.stdout.on("data", async (data) => {
        const index = chunks.length % maxIndex;
        chunks.push([format2Names[index], data]);
        if (index + 1 === maxIndex) {
            result.push(Object.fromEntries(chunks));
            chunks = [];
        }
        lines.push(data);
    });
    await command.spawn();
    return new Promise<GitLog[]>((resolve) => {
        command.on("close", () => {
            resolve(result);
        });
    });
    // command.stdout.on("data", async (data) => {
    //     lines.push(data);
    // });
    // await command.spawn();
    // return new Promise<GitLog[]>((resolve) => {
    //     const result: Array<() => Promise<GitLog>> = [];
    //     command.on("close", async () => {
    //         for (let i = 0; i < lines.length; i += maxIndex) {
    //             const chunks: string[][] = [];
    //             for (const item of lines.slice(i, i + maxIndex)) {
    //                 chunks.push([format2Names[chunks.length], item]);
    //             }
    //             const logInfo: GitLog = Object.fromEntries(chunks);
    //             result.push(async () => {
    //                 return {
    //                     ...logInfo,
    //                 };
    //             });
    //         }
    //         resolve(await Promise.all(result.map((item) => item())));
    //     });
    // });
};

export const gitLogMsg = async (hash: string, cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["log", hash, `-1`, "--format=%B"], {
        cwd,
    });
    const lines: string[] = [];
    command.stdout.on("data", (line) => [lines.push(line)]);
    const child = await command.execute();
    return lines;
};
