import { curRepoDir, isBlur, isFocus } from "@/store";
import { effect, nextTick, watch } from "vue";
import { sleep } from ".";
import { watch as watchFile, DebouncedEvent } from "tauri-plugin-fs-watch-api";
import { debounce, throttle } from "lodash";
const loopFns: any[] = [];
export const loop = (fn: any) => {
    let handle: number | null;
    const loopInnerSchedule = async () => {
        await fn().catch((e: any) => {
            console.log(e);
        });
        if (isBlur.value) {
            handle = null;
            return;
        }
        nextTick(async () => {
            await sleep(600);
            handle = requestIdleCallback(loopInnerSchedule);
        });
    };
    requestIdleCallback(() => {
        handle = requestIdleCallback(loopInnerSchedule);
        watch(
            () => isFocus.value,
            (isFocus) => {
                if (handle === null && isFocus) {
                    handle = requestIdleCallback(loopInnerSchedule);
                }
            }
        );
    });
    if (loopFns.includes(fn)) {
        return;
    }
    loopFns.push(fn);
};
let handle: number | null = null;
let index = 0;
const maxRequestNum = 3;
const loopScheduler: IdleRequestCallback = async (deadline) => {
    let requests: Promise<any>[] = [];
    if (maxRequestNum >= loopFns.length) {
        requests = loopFns.map((f) => f());
    } else {
        let start = index;
        for (; start < index + maxRequestNum; start++) {
            requests.push(loopFns[start % loopFns.length]?.());
        }
        index = start % loopFns.length;
    }
    await Promise.all(requests);
    if (isBlur.value) {
        handle = null;
        return;
    }
    nextTick(async () => {
        await sleep(200);
        handle = requestIdleCallback(loopScheduler);
    });
};

let stopWatch: Function;
const cbs = new Set<Function>();
const changes: DebouncedEvent[] = [];
const emitCbs = debounce(async () => {
    const curChanges = [...changes];
    changes.length = 0;
    await Promise.all([...cbs].map((cb) => cb(curChanges)));
});
window.addEventListener("load", () => {
    // handle = requestIdleCallback(loopScheduler);
    watch(
        () => isFocus.value,
        (isFocus) => {
            // if (handle === null && isFocus) {
            //     handle = requestIdleCallback(loopScheduler);
            // }
        }
    );
    return;
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
