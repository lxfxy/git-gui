import {
    readTextFile,
    writeTextFile,
    createDir,
    BaseDirectory,
    FsOptions,
    FsDirOptions,
    exists,
    readDir as tauriReadDir,
} from "@tauri-apps/api/fs";
import { dirname } from "@tauri-apps/api/path";
const fsOptions: FsOptions = {
    dir: BaseDirectory.Resource,
};
export const mkdir = (dir: string, options?: FsDirOptions) => {
    options = Object.assign({}, fsOptions, options);
    return createDir(dir, options);
};
export const readDir = (dir: string, options: FsDirOptions) => {
    options = Object.assign({}, fsOptions, options);
    return tauriReadDir(dir, options);
};
export const readFile = (path: string, options?: FsOptions) => {
    options = Object.assign({}, fsOptions, options);
    return readTextFile(path, options);
};
export const readFileToJSON = async <T>(
    path: string,
    defaultValue?: T,
    options?: FsOptions
): Promise<T> => {
    try {
        const res = await readFile(path, options);
        return JSON.parse(res);
    } catch {
        return defaultValue || ({} as any);
    }
};
export const isExists = async (dir: string, create: boolean = false) => {
    let flag: any = await exists(dir, fsOptions);
    if (!flag && create) {
        mkdir(dir, { recursive: true });
        flag = true;
    }
    return flag;
};
export const writeFile = async (
    path: string,
    content: string,
    options?: FsOptions
) => {
    options = Object.assign({}, fsOptions, options);
    const dir = await dirname(path);
    await isExists(dir, true);
    return writeTextFile(path, content, options);
};
isExists("data", true);
