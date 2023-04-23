import { curRepoDir } from "@/store";
import { effect, nextTick, watch } from "vue";
import { sleep } from ".";
import { watch as watchFile, DebouncedEvent } from "tauri-plugin-fs-watch-api";
import { debounce } from "lodash";
import { listen } from "@tauri-apps/api/event";
import { useRef } from "@/hooks";

// const [isBlur, setBlurFlag] = useRef(false);
// const [isFocus, setFocusFlag] = useRef(false);
let isBlur = false,
    isFocus = false;
listen("tauri://blur", () => {
    isBlur = true;
    isFocus = false;
});
listen("tauri://focus", () => {
    isBlur = false;
    isFocus = true;
    // requestIdleCallback(loopScheduler);
});
const loopFns: any[] = [];
export const loop = (fn: any) => {
    if (loopFns.includes(fn)) {
        return;
    }
    loopFns.push(fn);
};
let handle: number;
const loopScheduler: IdleRequestCallback = async (deadline) => {
    cancelIdleCallback(handle);
    await Promise.all(loopFns.map((fn) => fn()));
    await sleep(600);
    // if (isFocus) {
    //     handle = requestIdleCallback(loopScheduler);
    // }
};
requestIdleCallback(loopScheduler);
let stopWatch: Function;
const cbs = new Set<Function>();
const changes: DebouncedEvent[] = [];
const emitCbs = debounce(async () => {
    const curChanges = [...changes];
    changes.length = 0;
    await Promise.all([...cbs].map((cb) => cb(curChanges)));
});
window.addEventListener("load", () => {
    effect(async () => {
        if (stopWatch) {
            stopWatch();
        }
        if (!curRepoDir.value) {
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
