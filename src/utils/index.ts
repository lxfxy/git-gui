import { sep } from "@tauri-apps/api/path";
import { withModifiers } from "vue";

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

export const jsxClickStop = withModifiers(() => {}, ["stop"]);

export const arrayToObj = <T extends any[]>(
    arr: T,
    key: keyof T[0]
): Record<string, T[0]> => {
    return arr.reduce((memo, item) => {
        memo[item[key]] = item;
        return memo;
    }, {} as any);
};

/**
 * 如果数组中存在相同值的内容，将不会插入
 */
export const addArrayOnce = <T extends any[]>(array: T, ...values: T) => {
    for (const item of values) {
        if (!array.includes(item)) {
            array.push(item);
        }
    }
};

export const filterArrayItems = <T extends any[]>(array: T, ...values: T) => {
    return array.filter((item) => {
        return !values.includes(item);
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
export * from "./gitRestore";
export * from "./gitMerge";
export * from "./loop";
