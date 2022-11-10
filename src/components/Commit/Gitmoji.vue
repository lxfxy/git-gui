<script setup lang="ts">
import { NIcon, NScrollbar, NSpin } from "naive-ui";
import { apply, tw } from "twind";
import { getGitMojis, gitmojis } from "@/store/gitmoji";
import { ReloadOutline } from "@vicons/ionicons5";
import Opacity from "../Transiton/Opacity.vue";

const event = defineEmits<{
    (event: "select", info: string): void;
}>();
const { isFetching, data, refetch } = getGitMojis();
const hover = apply`transition-all hover:scale-[1.1] cursor-pointer`;
</script>

<template>
    <div :class="tw`w-[60vw] h-[60vh] flex flex-col`">
        <Opacity>
            <div
                :class="
                    tw`center w-full h-full absolute top-0 left-0 bg-bgColor2 opacity-60 z-20`
                "
                v-show="isFetching"
            >
                <NSpin></NSpin>
            </div>
        </Opacity>
        <NIcon
            :class="
                tw`absolute z-10 right-[20px] top-[20px] cursor-pointer duration-300 transition-transform hover:rotate-180 bg-bgColor1 p-[6px] rounded-[50%] box-content`
            "
            :size="20"
            @click="refetch"
        >
            <ReloadOutline />
        </NIcon>
        <NScrollbar :class="tw`flex-1`">
            <div :class="tw`grid grid-cols-4 gap-[10px] text-center`">
                <div
                    v-for="item in data"
                    :class="tw`py-[10px] center flex-col`"
                >
                    <div
                        :class="tw`text-[28px] ${hover}`"
                        @click="event(`select`, item.emoji)"
                    >
                        {{ item.emoji }}
                    </div>
                    <code
                        :class="tw`my-[6px] block text-[14px] ${hover}`"
                        @click="event(`select`, item.code)"
                    >
                        {{ item.code }}
                    </code>
                    <div>{{ item.description }}</div>
                </div>
            </div>
        </NScrollbar>
    </div>
</template>
