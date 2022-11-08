import {
    readTextFile,
    writeTextFile,
    createDir,
    BaseDirectory,
    FsOptions,
    FsDirOptions,
    readDir as tauriReadDir,
} from "@tauri-apps/api/fs";
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
    options?: FsOptions
): Promise<T> => {
    try {
        const res = await readFile(path, options);
        return JSON.parse(res);
    } catch {
        return {} as any;
    }
};
export const writeFile = (
    path: string,
    content: string,
    options?: FsOptions
) => {
    options = Object.assign({}, fsOptions, options);
    return writeTextFile(path, content, options);
};

readDir("data", { recursive: true });
