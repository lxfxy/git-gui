import { curRepoDir } from "@/store";
import { effect } from "vue";
import { sleep } from ".";
import { watch, DebouncedEvent } from "tauri-plugin-fs-watch-api";
import { debounce } from "lodash";

export const loop = (fn: Function, timer = 1000) => {
    const scheduler = async () => {
        await fn();
        await sleep(timer);
        requestIdleCallback(scheduler);
    };
    requestIdleCallback(scheduler);
};

let stopWatch: Function;
const cbs = new Set<Function>();
const changes: DebouncedEvent[] = [];
const emitCbs = debounce(() => {
    const curChanges = [...changes];
    changes.length = 0;
    for (const cb of cbs) {
        cb(curChanges);
    }
}, 200);
window.addEventListener("load", () => {
    effect(async () => {
        if (stopWatch) {
            stopWatch();
        }
        if (!curRepoDir.value) {
            return;
        }
        stopWatch = await watch(
            `${curRepoDir.value}`,
            { recursive: true },
            (e) => {
                if ((e.payload as string).endsWith(".git")) {
                    return;
                }
                // console.log("watch .git \n", e);
                changes.push(e);
                emitCbs();
            }
        );
    });
});
export const repoChangeWatch = (fn: Function) => {
    cbs.add(fn);
};
