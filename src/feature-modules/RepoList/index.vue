<script setup lang="ts">
import {
    getLocalRepo,
    RepoInfo,
    repos,
    setContextmenuRepo,
} from "@/store/repo";
import { NButton, NIcon, NPopover, NScrollbar, useMessage } from "naive-ui";
import { PlaylistAddTwotone } from "@vicons/material";
import { tw } from "twind";
import { curRepo, setCurRepo } from "@/store/repo";
import { CopyOutline } from "@vicons/ionicons5";
import { writeText } from "@tauri-apps/api/clipboard";
import { ref } from "vue";
import Operation from "./Operation.vue";
const message = useMessage();
const copyRepoName = async (name: string) => {
    try {
        await writeText(name);
        message.success(`${name} 复制成功`);
    } catch (error) {
        message.error(`${name} 复制失败`);
    }
};
const show = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const contextmenu = (repo: RepoInfo, e: MouseEvent) => {
    e.preventDefault();
    xRef.value = e.clientX;
    yRef.value = e.clientY;
    setContextmenuRepo(repo);
    show.value = true;
};
window.addEventListener("click", () => {
    show.value = false;
});
</script>

<template>
    <div :class="tw`flex flex-col flex-1`">
        <NPopover
            trigger="manual"
            :x="xRef"
            :y="yRef"
            :show="show"
            placement="right"
        >
            <Operation />
        </NPopover>
        <div :class="tw`title flex justify-between items-center`">
            <div>仓库列表</div>
            <NButton quaternary type="success">
                <template #icon>
                    <NIcon
                        :class="tw`cursor-pointer`"
                        size="24"
                        @click="getLocalRepo"
                    >
                        <PlaylistAddTwotone />
                    </NIcon>
                </template>
            </NButton>
        </div>
        <NScrollbar
            :class="tw`text-color1 transition-color select-none flex-1`"
        >
            <div
                v-for="(item, key) in repos"
                :key="key"
                :class="
                    tw`hover:bg-bgColor1 transition-color p-[10px] cursor-pointer`
                "
                @dblclick="setCurRepo(item)"
                @contextmenu="contextmenu(item, $event)"
            >
                <span
                    :class="
                        tw`opacity-${
                            curRepo?.dir === item.dir ? `100` : `0`
                        } transition-opacity text-[18px]`
                    "
                >
                    ✅
                </span>
                <span>
                    {{ item.title }}
                </span>
            </div>
        </NScrollbar>
    </div>
</template>
