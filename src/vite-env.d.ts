/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module globalThis {
    interface Window {
        showOpenFilePicker(): any;
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
        showDirectoryPicker(
            id: string,
            mode: "read" | "readwrite",
            startIn:
                | "desktop"
                | "documents"
                | "downloads"
                | "music"
                | "pictures"
                | "videos"
        ): Promise<FileSystemDirectoryHandle>;
    }
}

declare type NTagProps = Exclude<
    typeof import("naive-ui")["NTag"]["__defaults"],
    undefined
>;

interface FileSystemDirectoryHandle {
    keys(): IterableIterator<Promise<string>>;
    values(): Promise<
        IterableIterator<
            Promise<FileSystemDirectoryHandle | FileSystemFileHandle>
        >
    >;
}
