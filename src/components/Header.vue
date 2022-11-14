<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apply, tw } from "twind";
import { css } from "twind/css";
import { NIcon } from "naive-ui";
import { appWindow } from "@tauri-apps/api/window";
import {
    CloseRound,
    MinusRound,
    ZoomInMapRound,
    ZoomOutMapRound,
} from "@vicons/material";
import ChangeTheme from "./ChangeTheme.vue";
import { curRepo } from "@/store/repo";
import { curRepoBranch } from "@/store";
const height = 40;
onMounted(() => {
    document.body.style.setProperty("--titlebar-height", height + "px");
});
const header = css`
    ${apply`z-[9999] pointer-events-none`};

    .n-icon {
        ${apply`center h-full w-[46px] transition-color cursor-pointer`};

        &:hover {
            ${apply`bg-bgColor2`};
        }
        &:last-child:hover {
            ${apply`bg-red-900`};
        }
    }
    > * {
        ${apply`z-[1] pointer-events-auto`};
    }
`;
const isMaximize = ref(false);
const resize = async () => {
    isMaximize.value = await appWindow.isMaximized();
};
window.addEventListener("resize", resize);
resize();
</script>
<template>
    <span :class="tw`hidden`">{{ tw }}</span>
    <div
        :class="
            tw`min-h-[${height}px] bg-bgColor1 text-color1 flex justify-between items-center transition-color ${header}`
        "
    >
        <span :class="tw`text-[14px] mx-[10px]`">
            Git可视化
            <code>
                ({{ curRepo?.title || "请选择一个仓库" }}^{{
                    curRepoBranch?.name
                }})
            </code>
        </span>

        <div :class="tw`flex h-full items-center`">
            <ChangeTheme />
            <NIcon size="22" @click="appWindow.minimize()">
                <MinusRound />
            </NIcon>
            <NIcon size="22" @click="appWindow.toggleMaximize()">
                <ZoomInMapRound v-show="isMaximize" />
                <ZoomOutMapRound v-show="!isMaximize" />
            </NIcon>
            <NIcon size="22" @click="appWindow.close()">
                <CloseRound />
            </NIcon>
        </div>
    </div>
</template>

<style lang="less">
.titlebar {
    height: var(--titlebar-height);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
}
</style>
