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

interface FileSystemDirectoryHandle {
    keys(): IterableIterator<Promise<string>>;
    values(): Promise<
        IterableIterator<
            Promise<FileSystemDirectoryHandle | FileSystemFileHandle>
        >
    >;
}
