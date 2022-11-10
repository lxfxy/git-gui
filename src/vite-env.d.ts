/// <reference types="vite/client" />
import { DefineComponent } from "vue";

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "vue" {
    export declare interface VNode<HostNode> {
        $el: HostNode;
    }
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
