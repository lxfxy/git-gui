import { curRepo, curRepoDir } from "@/store";
import { sep } from "@tauri-apps/api/path";
import { getFilePathLastText } from ".";
import { runCommand } from "./command";
export interface FileStatus {
    symbol: string;
    status: FileStatusType;
    filepath: string;
    filename: string;
}
export enum RepoWorkTree {
    Workspace,
    History,
}
export type FileStatusType = "Modify" | "New" | "Delete";
export const fileStatusType: FileStatusType[] = ["Delete", "Modify", "New"];
const fileStatusMap: Record<string, FileStatusType> = {
    M: "Modify",
    "?": "New",
    D: "Delete",
    A: "New",
};

export const getRepoFileStatus = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["status", "--porcelain"], { cwd });
    const files: FileStatus[] = [];
    const historyFiles: FileStatus[] = [];
    command.stdout.on("data", async (info: string) => {
        let [, historySymbol, symbol, filepath] =
            /(.)(.)\s(\S+)/.exec(info.replace(/("|')/g, "")) || [];
        symbol = symbol.trim();
        historySymbol = historySymbol.trim();
        const filename = getFilePathLastText(filepath.replaceAll("/", sep));
        if (historySymbol && historySymbol !== "?") {
            historyFiles.push({
                symbol: historySymbol,
                status: fileStatusMap[historySymbol],
                filepath,
                filename,
            });
        }
        if (symbol) {
            files.push({
                symbol,
                status: fileStatusMap[symbol],
                filepath,
                filename,
            });
        }
    });
    const child = await command.spawn();

    return new Promise<FileStatus[][]>((resolve) => {
        command.on("close", () => {
            resolve([files, historyFiles]);
        });
    });
};

export const historyRepoFiles = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["add", "."], { cwd });
    return await command.execute();
};

export const commitRepo = async (msg: string, cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["commit", "-m", msg], { cwd });
    return await command.execute();
};

export const commitAmendRepo = async (
    msg: string,
    cwd: Cwd = curRepoDir.value
) => {
    const command = runCommand("git", ["commit", "--amend", "-m", msg], {
        cwd,
    });
    return await command.execute();
};
