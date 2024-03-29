<script setup lang="ts">
import {
    allRemotes,
    contextmenuScheduler,
    curRepo,
    getLocalRepo,
    repoCurGroupRepos,
    RepoInfo,
    setContextmenuRemote,
    setContextmenuRepo,
    setCurRepo,
} from "@/store";
import { addRemote, Clone } from "@/utils";
import { css } from "@twind/core";
import { Add, CheckmarkDoneSharp } from "@vicons/ionicons5";
import { PlaylistAddTwotone } from "@vicons/material";
import {
    NButton,
    NButtonGroup,
    NCollapse,
    NCollapseItem,
    NIcon,
    NPopover,
    NScrollbar,
    NTooltip,
} from "naive-ui";
import { Ref, ref } from "vue";
import Groups from "./Goups.vue";
import Operation from "./Operation.vue";
import RemoteOperation from "./RemoteOperation.vue";
const container = ref<HTMLDivElement>() as Ref<HTMLDivElement>;
const { x, y, show, open, close, setContainer } = contextmenuScheduler;
setContainer(container);
const contextmenu = (item: RepoInfo, e: MouseEvent) => {
    e.preventDefault();
    setContextmenuRepo(item);
    setContextmenuRemote();
    open();
};
</script>

<template>
    <div :class="`flex flex-col flex-1 overflow-hidden`" ref="container">
        <NPopover
            trigger="manual"
            :x="x"
            :y="y + 50"
            :show="show"
            placement="right"
            :arrow-style="{
                top: `calc(50% - 50px)`,
            }"
            @clickoutside="close"
        >
            <Operation />
            <RemoteOperation />
        </NPopover>
        <div :class="`title flex justify-between items-center`">
            <div :class="[`flex gap-x-[6px] items-center`]">
                仓库列表 <Groups />
            </div>
            <NButtonGroup>
                <NButton quaternary type="success" @click="Clone">
                    克隆
                </NButton>
                <NButton quaternary type="success">
                    <template #icon>
                        <NIcon
                            :class="`cursor-pointer`"
                            size="24"
                            @click="getLocalRepo"
                        >
                            <PlaylistAddTwotone />
                        </NIcon>
                    </template>
                </NButton>
            </NButtonGroup>
        </div>
        <NScrollbar
            :class="`text-color1 transition-color flex-1`"
            @scroll="close"
        >
            <NCollapse>
                <NCollapseItem
                    v-for="(repo, key) in repoCurGroupRepos"
                    :key="key"
                    :class="[
                        `p-[10px] cursor-pointer !mt-0`,
                        `${css`
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
                                    @apply opacity-100;
                                }
                            }

                            .n-collapse-item__header-extra {
                                transition: opacity 0.3s !important;
                            }
                        `}`,
                        curRepo?.dir === repo.dir
                            ? `bg-bgColor1` + ` active`
                            : ``,
                    ]"
                    @contextmenu.capture="contextmenu(repo, $event)"
                >
                    <div
                        v-for="remote in allRemotes[repo.dir]"
                        :key="remote.name"
                        :class="`flex flex-col overflow-hidden transition hover:bg-bgColor2`"
                        @contextmenu.capture="setContextmenuRemote(remote)"
                    >
                        <div
                            :class="`gap-x-[10px] p-[10px]`"
                            v-for="item in remote.urls"
                            :key="item.type"
                        >
                            <div :class="`flex gap-x-[6px]`">
                                <code>{{ item.name }}</code>
                                <code>({{ item.type }})</code>
                            </div>
                            <code
                                :class="`flex-1 whitespace-normal break-words`"
                            >
                                {{ item.url }}
                            </code>
                        </div>
                    </div>
                    <template #header>
                        <div :class="`ml-[4px]`">
                            {{ repo.title }}
                        </div>
                    </template>
                    <template #header-extra>
                        <NButtonGroup>
                            <NTooltip :delay="1000">
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
                            <NTooltip :delay="1000">
                                <template #trigger>
                                    <NButton
                                        quaternary
                                        type="success"
                                        @click.stop="addRemote({ repo })"
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
