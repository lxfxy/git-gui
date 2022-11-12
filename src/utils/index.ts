import { sep } from "@tauri-apps/api/path";
export * from "./command";
export * from "./file";
export * from "./gitStatus";
export * from "./gitBranch";
export * from "./gitSwitch";
/**
 * 获取一个路径的最后的名字
 */
export const getFilePathLastText = (path: string) => {
    const paths = path.split(sep);
    let i = paths.length;
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

export const loop = (fn: Function, timer = 600) => {
    const scheduler = async () => {
        await fn();
        await sleep(timer);
        requestIdleCallback(scheduler);
    };
    requestIdleCallback(scheduler);
};
