import { curRepoDir, isBlur, isFocus } from "@/store";
import { effect, nextTick, watch } from "vue";
import { sleep } from ".";
import { watch as watchFile, DebouncedEvent } from "tauri-plugin-fs-watch-api";
import { debounce } from "lodash";
const loopFns: any[] = [];
export const loop = (fn: any) => {
    if (loopFns.includes(fn)) {
        return;
    }
    loopFns.push(fn);
};
let handle: number;
let index = 0;
const loopScheduler: IdleRequestCallback = async (deadline) => {
    const requests: Promise<any>[] = [];
    let start = index;
    for (start; start < index + 2; start++) {
        console.log(start);
        requests.push(loopFns[start % loopFns.length]?.());
    }
    index = start % loopFns.length;
    await Promise.all(requests);
    await sleep(600);
};
// requestIdleCallback(loopScheduler);
let stopWatch: Function;
const cbs = new Set<Function>();
const changes: DebouncedEvent[] = [];
const emitCbs = debounce(async () => {
    const curChanges = [...changes];
    changes.length = 0;
    await Promise.all([...cbs].map((cb) => cb(curChanges)));
});
window.addEventListener("load", () => {
    watch(() => isFocus.value, emitCbs);
    effect(async () => {
        if (stopWatch) {
            stopWatch();
        }
        if (!curRepoDir.value) {
            return;
        }
        if (isBlur.value) {
            return;
        }
        await emitCbs();
        stopWatch = await watchFile(
            `${curRepoDir.value}/.git`,
            { recursive: true },
            (e) => {
                if ((e.payload as string).endsWith(".git")) {
                    return;
                }
                changes.push(e);
                emitCbs();
            }
        );
    });
});
export const repoChangeWatch = (fn: Function) => {
    cbs.add(fn);
};
