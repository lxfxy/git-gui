import { dirname, sep } from "@tauri-apps/api/path";

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
