<script setup lang="ts">
import {
    getLocalRepo,
    RepoInfo,
    repos,
    setContextmenuRepo,
    allRemotes,
    curRepo,
    setCurRepo,
} from "@/store";
import {
    NButton,
    NButtonGroup,
    NCollapse,
    NCollapseItem,
    NIcon,
    NPopover,
    NScrollbar,
    NTooltip,
    useMessage,
} from "naive-ui";
import { PlaylistAddTwotone } from "@vicons/material";
import { apply, tw } from "twind";
import { Ref, ref } from "vue";
import Operation from "./Operation.vue";
import { useContextmenu } from "@/hooks";
import { css } from "twind/css";
import { Add, CheckmarkDoneSharp } from "@vicons/ionicons5";
const container = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const { x, y, show, open } = useContextmenu({ container });
const contextmenu = (item: RepoInfo, e: MouseEvent) => {
    e.preventDefault();
    setContextmenuRepo(item);
    open();
};
</script>

<template>
    <div :class="tw`flex flex-col flex-1 overflow-hidden`" ref="container">
        <NPopover trigger="manual" :x="x" :y="y" :show="show" placement="right">
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
            <NCollapse>
                <NCollapseItem
                    v-for="(repo, key) in repos"
                    :key="key"
                    :class="[
                        tw`p-[10px] cursor-pointer mt-0!`,
                        tw`${css`
                            transition: background-color 0.6s !important;

                            .n-collapse-item__header {
                                padding-top: 0 !important;
                                position: sticky !important;
                                top: 0px;
                                left: 0px;
                                transition: background-color 0.6s !important;
                                background-color: var(--bg-color2);
                            }

                            &:hover,
                            &:hover .n-collapse-item__header,
                            &.active,
                            &.active .n-collapse-item__header {
                                background-color: var(--bg-color) !important;
                                .n-collapse-item__header-extra {
                                    ${apply`opacity-100`}
                                }
                            }

                            .n-collapse-item__header-extra {
                                ${apply`opacity-0`}
                                transition: opacity .3s !important;
                            }
                        `}`,
                        curRepo?.dir === repo.dir
                            ? tw`bg-bgColor1` + ` active`
                            : ``,
                    ]"
                    @contextmenu="contextmenu(repo, $event)"
                >
                    <div
                        v-for="remote in allRemotes[repo.dir]"
                        :key="remote.name"
                        :class="tw`flex flex-col overflow-hidden`"
                    >
                        <div
                            :class="
                                tw`center gap-x-[10px] p-[10px] transition hover:bg-bgColor2`
                            "
                            v-for="item in remote.urls"
                            :key="item.type"
                        >
                            <div :class="tw`flex flex-col gap-y-[6px]`">
                                <code>{{ item.name }}</code>
                                <code>({{ item.type }})</code>
                            </div>
                            <code
                                :class="
                                    tw`flex-1 whitespace-normal break-words`
                                "
                            >
                                {{ item.url }}
                            </code>
                        </div>
                    </div>
                    <template #header>
                        <div :class="tw`ml-[4px]`">
                            {{ repo.title }}
                        </div>
                    </template>
                    <template #header-extra>
                        <NButtonGroup>
                            <NTooltip>
                                <template #trigger>
                                    <NButton
                                        quaternary
                                        type="success"
                                        @click.stop="setCurRepo(repo)"
                                        :disabled="curRepo?.dir === repo.dir"
                                    >
                                        <NIcon size="20">
                                            <CheckmarkDoneSharp />
                                        </NIcon>
                                    </NButton>
                                </template>
                                切换至当前仓库
                            </NTooltip>
                            <NTooltip>
                                <template #trigger>
                                    <NButton
                                        quaternary
                                        type="success"
                                        @click.stop
                                    >
                                        <NIcon size="24">
                                            <Add />
                                        </NIcon>
                                    </NButton>
                                </template>
                                添加源
                            </NTooltip>
                        </NButtonGroup>
                    </template>
                </NCollapseItem>
            </NCollapse>
        </NScrollbar>
    </div>
</template>