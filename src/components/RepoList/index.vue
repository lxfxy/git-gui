<script setup lang="ts">
import { getLocalRepo, repos } from "@/store/repo";
import { NButton, NIcon, NScrollbar, useMessage } from "naive-ui";
import { PlaylistAddTwotone } from "@vicons/material";
import { tw } from "twind";
import { curRepo, setCurRepo } from "@/store/repo";
import { CopyOutline } from "@vicons/ionicons5";
import { writeText } from "@tauri-apps/api/clipboard";
const message = useMessage();
const copyRepoName = async (name: string) => {
    try {
        await writeText(name);
        message.success(`${name} 复制成功`);
    } catch (error) {
        message.error(`${name} 复制失败`);
    }
};
</script>

<template>
    <div :class="tw`flex flex-col flex-1`">
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
                    <NIcon @click="copyRepoName(item.title)">
                        <CopyOutline />
                    </NIcon>
                </span>
            </div>
        </NScrollbar>
    </div>
</template>
