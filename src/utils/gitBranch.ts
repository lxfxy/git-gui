import { curRepoDir } from "@/store";
import { runCommand } from "./command";

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
    remotes: boolean;
    heads: boolean;
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
    return new Promise<[GitBranch, GitBranch[]]>((resolve) => {
        let activeBranch: GitBranch;
        let chunks: string[][] = [];
        const branchs: GitBranch[] = [];
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
                branchs.push(branchInfo);
                if (branchInfo.current) {
                    activeBranch = branchInfo;
                }
                chunks = [];
            }
        });
        command.on("close", () => {
            resolve([activeBranch, branchs]);
        });
    });
};
