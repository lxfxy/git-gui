<script setup lang="ts">
import { effect, onMounted, reactive, Ref, ref, watch } from "vue";
import ConfigProvider from "./components/ConfigProvider/index.vue";
import Header from "./components/Header.vue";
import LoadingBar from "./components/LoadingBar/index.vue";
import Initial from "./components/Initial.vue";
import RepoList from "./feature-modules/RepoList/index.vue";
import RepoFiles from "./feature-modules/RepoFiles/index.vue";
import Commit from "./feature-modules/Commit/index.vue";
import Log from "./feature-modules/Log/index.vue";
import Branch from "./feature-modules/Branch/index.vue";
import { readFileToJSON, writeFile } from "@/utils";
import { debounce } from "lodash";
import { tw } from "twind";
onMounted(() => {
    document.getElementById("loading-control")!.style.display = "none";
});
const containerRef = ref<HTMLDivElement>();
const lineWidth = `4px`;
const layout = reactive({
    side: 20,
    commit: 24,
});
readFileToJSON("data/layout.json")
    .then((newLayout) => {
        Object.assign(layout, newLayout);
    })
    .finally(() => {
        watch(
            () => layout,
            debounce(() => {
                writeFile("data/layout.json", JSON.stringify(layout));
            }, 400),
            {
                deep: true,
            }
        );
    });

const mouseStart = (
    layoutName: keyof typeof layout,
    max: number,
    min: number,
    direction: "x" | "y",
    e: MouseEvent
) => {
    const el = e.target as HTMLDivElement;
    const anchorWidth =
        direction === "x"
            ? containerRef.value!.clientWidth
            : containerRef.value!.clientHeight;
    document.body.style.userSelect = "none";
    el.classList.add("active");
    const mouseMove = (e: MouseEvent) => {
        const targetValue = direction === "x" ? e.clientX : e.clientY - 40;
        let value = Math.floor((targetValue / anchorWidth) * 1000) / 10;
        value = Math.min(max, value);
        value = Math.max(min, value);
        layout[layoutName] = value;
    };
    const mouseup = () => {
        el.classList.remove("active");
        document.body.style.userSelect = "auto";
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseup);
    };
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mouseleave", mouseup);
};
</script>

<template>
    <ConfigProvider>
        <LoadingBar>
            <Initial />
            <div :class="tw`h-screen w-screen flex flex-col overflow-hidden`">
                <Header></Header>
                <div
                    :class="tw`grid overflow-hidden flex-1`"
                    :style="{
                        gridTemplateColumns: `${layout.side}% ${lineWidth} 1fr`,
                        gridTemplateRows: `1fr`,
                    }"
                    ref="containerRef"
                >
                    <div
                        :class="tw`overflow-hidden grid`"
                        :style="{
                            gridTemplateRows: `1fr 1fr 1fr`,
                            gridTemplateColumns: `1fr`,
                        }"
                    >
                        <RepoList></RepoList>
                        <!-- <div
                            class="drag-line"
                            :class="[tw`cursor-n-resize`]"
                        ></div> -->
                        <Branch></Branch>
                        <!-- <div
                            class="drag-line"
                            :class="[tw`cursor-n-resize`]"
                        ></div> -->
                        <Log></Log>
                    </div>
                    <div
                        class="drag-line"
                        :class="[tw`cursor-w-resize`]"
                        @mousedown="mouseStart(`side`, 60, 20, `x`, $event)"
                    ></div>
                    <div
                        :class="tw`overflow-hidden grid`"
                        :style="{
                            gridTemplateRows: `${layout.commit}% ${lineWidth} 1fr`,
                            gridTemplateColumns: `1fr`,
                        }"
                    >
                        <Commit></Commit>
                        <div
                            class="drag-line"
                            :class="[tw`cursor-n-resize`]"
                            @mousedown="
                                mouseStart(`commit`, 50, 24, `y`, $event)
                            "
                        ></div>
                        <RepoFiles></RepoFiles>
                    </div>
                </div>
                <!-- <div
                    :class="[tw`grid overflow-hidden`]"
                    :style="{
                        gridTemplateAreas,
                        gridTemplateColumns,
                        gridTemplateRows,
                    }"
                >
                    <RepoList style="grid-area: repoList"></RepoList>
                    <Branch style="grid-area: branch"></Branch>
                    <Log style="grid-area: log"></Log>
                    <Commit style="grid-area: commit"></Commit>
                    <RepoFiles style="grid-area: repoFiles"></RepoFiles>
                </div> -->
            </div>
        </LoadingBar>
    </ConfigProvider>
</template>
