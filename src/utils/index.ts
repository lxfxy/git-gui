import { curRepoDir } from "@/store";
import { sep } from "@tauri-apps/api/path";
import { watch } from "tauri-plugin-fs-watch-api";
import { effect } from "vue";

/**
 * 获取一个路径的最后的名字
 */
export const getFilePathLastText = (path: string) => {
    const paths = path.split(sep);
    let i = paths.length - 1;
    while (!paths[i]) {
        i--;
    }
    return paths[i];
};

export const sleep = (timer: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(timer);
        }, timer);
    });
};

export * from "./command";
export * from "./file";
export * from "./gitStatus";
export * from "./gitBranch";
export * from "./gitSwitch";
export * from "./gitPush";
export * from "./gitRemote";
export * from "./gitLog";
export * from "./gitRebase";
export * from "./gitPull";
export * from "./gitClone";
export * from "./loop";
