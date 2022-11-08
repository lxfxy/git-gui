<script setup lang="ts">
import { getLocalRepo, repos } from "@/store/repo";
import { NButton, NIcon, useMessage } from "naive-ui";
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
    <div>
        <div :class="tw`text-color1 transition-color select-none`">
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
        </div>
        <NButton block type="info" @click="getLocalRepo"> 添加仓库 </NButton>
    </div>
</template>
