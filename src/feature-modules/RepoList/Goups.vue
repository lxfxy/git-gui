<script setup lang="tsx">
import {
    NInput,
    NPopover,
    NTag,
    NIcon,
    NButton,
    NPopconfirm,
    NBadge,
    NSelect,
    SelectProps,
    NEllipsis,
    NScrollbar,
} from "naive-ui";
import { MdSearch } from "@vicons/ionicons4";
import { Add, PencilOutline } from "@vicons/ionicons5";
import {
    repoGroups,
    removeRepoGroups,
    changeRepoGroupName,
    addRepoGroups,
    RepoGroup,
    repoGroupsName,
    setRepoCurGroup,
    repoCurGroup,
} from "@/store";
import { tw } from "twind";
import { EngRenderCodeTag } from "@/components";
import { DeleteOutlineSharp } from "@vicons/material";
import { ref, watch, withModifiers } from "vue";
import { filterArrayItems, jsxClickStop } from "@/utils";
const groupName = ref("");
const newName = ref("");
const createName = ref("");
const value = ref<string>();
const select = ref<GetCompSetupReturn<typeof NSelect>>();
const addGroup = () => {
    addRepoGroups(groupName.value);
    groupName.value = ``;
};
const RenderLabel: SelectProps["renderLabel"] = (item: RepoGroup, selected) => {
    const isNewLabel = !repoGroupsName.value.includes(item.name);
    if (isNewLabel && item.name.trim()) {
        return (
            <div class={[tw`flex items-center gap-x-[10px]`]}>
                <NEllipsis>{item.name}</NEllipsis>

                <NPopover>
                    {{
                        trigger() {
                            return <NTag type="primary">新标签</NTag>;
                        },
                        default() {
                            return <span>选择后会自动创建一个新的分组</span>;
                        },
                    }}
                </NPopover>
            </div>
        );
    }
    return (
        <div class={[tw`flex items-center gap-x-[6px] px-[10px] py-[1px]`]}>
            {false && (
                <NBadge
                    value={Object.keys(item.repos || {}).length || 2}
                    type="info"
                    showZero
                    show={false}
                ></NBadge>
            )}
            <NEllipsis class={[tw`mr-[10px] flex-1`]}>{item.name}</NEllipsis>
            <NPopconfirm
                onPositiveClick={() => {
                    if (repoCurGroup.value?.name === item.name) {
                        setRepoCurGroup(repoGroups.value![0]);
                    }
                    removeRepoGroups(item.name);
                }}
            >
                {{
                    trigger() {
                        return (
                            <NIcon
                                size="18"
                                color="#ff7875"
                                onClick={jsxClickStop}
                            >
                                <DeleteOutlineSharp />
                            </NIcon>
                        );
                    },
                    default() {
                        return <>确定要删除此分组吗？</>;
                    },
                }}
            </NPopconfirm>

            <NPopconfirm
                showIcon={false}
                onPositiveClick={() => {
                    changeRepoGroupName(item.name, newName.value);
                    newName.value = ``;
                }}
            >
                {{
                    trigger() {
                        return (
                            <NIcon size="18" onClick={jsxClickStop}>
                                <PencilOutline />
                            </NIcon>
                        );
                    },
                    default() {
                        return (
                            <NInput
                                placeholder="请输入新的分组名字"
                                v-model:value={newName.value}
                            />
                        );
                    },
                }}
            </NPopconfirm>
        </div>
    );
};
watch(
    () => value.value,
    (newValue) => {
        if (newValue && !repoGroupsName.value.includes(newValue)) {
            const newGroup = addRepoGroups(newValue);
            // setRepoCurGroup(newGroup);
            createName.value = newValue;
        } else {
            createName.value = "";
        }
    }
);
const onSelect = (optionValue: string, option: RepoGroup) => {
    value.value = optionValue;
    setRepoCurGroup(option);
};
</script>

<template>
    <NPopover placement="bottom" :width="400">
        <template #trigger>
            <NTag type="success" size="small">{{ repoCurGroup?.name }}</NTag>
        </template>
        <div :class="[tw`flex items-center gap-x-[6px]`]">
            <!-- <NInput
                v-model:value="groupName"
                placeholder="请输入分组名"
                @keyup.enter="addGroup"
            >
                <template #suffix>
                    <NIcon>
                        <MdSearch />
                    </NIcon>
                </template>
            </NInput> -->
            <NSelect
                :options="
                    repoGroups?.filter((item) => {
                        return item.name !== createName;
                    })
                "
                valueField="name"
                labelField="name"
                :renderLabel="RenderLabel"
                tag
                filterable
                :value="repoCurGroup?.name"
                @update:value="onSelect"
                ref="select"
                @blur="createName = ``"
            />
            <NPopover v-if="false">
                <template #trigger>
                    <NButton quaternary type="success" @click="addGroup">
                        <template #icon>
                            <Add />
                        </template>
                    </NButton>
                </template>
                将输入框的内容新建分组
            </NPopover>
        </div>
        <NScrollbar
            :class="[
                tw`flex gap-x-[14px] gap-y-[4px] mt-[14px] flex-wrap max-h-[300px]`,
            ]"
            v-if="repoGroups?.length"
        >
            <div
                v-for="item in repoGroups"
                :class="[
                    tw`w-full py-[6px]! transition duration-[300ms] hover:bg-bgColor2 cursor-pointer ${
                        repoCurGroup?.name === item.name ? `bg-bgColor2` : ``
                    }`,
                ]"
                @click="onSelect(item.name, item)"
            >
                <RenderLabel v-bind="item" />
            </div>
            <!-- <NBadge
                v-for="item in repoGroups"
                :key="item.name"
                :value="Object.keys(item.repos).length || 2"
                type="info"
            >
                <div
                    :class="[
                        tw`flex items-center gap-x-[6px] px-[10px] py-[8px] transition duration-[300ms] hover:bg-bgColor2 cursor-pointer`,
                    ]"
                >
                    <div :class="[tw`mr-[6px]`]">{{ item.name }}</div>
                    <NPopconfirm @positiveClick="removeRepoGroups(item.name)">
                        <template #trigger>
                            <NIcon size="18" color="#ff7875">
                                <DeleteOutlineSharp />
                            </NIcon>
                        </template>
                        确定要删除此分组吗？
                    </NPopconfirm>

                    <NPopconfirm
                        :showIcon="false"
                        @positiveClick="
                            changeRepoGroupName(item.name, newName);
                            newName = ``;
                        "
                    >
                        <template #trigger>
                            <NIcon size="18">
                                <PencilOutline />
                            </NIcon>
                        </template>
                        <NInput
                            placeholder="请输入新的分组名字"
                            v-model:value="newName"
                        />
                    </NPopconfirm>
                </div>
            </NBadge> -->
        </NScrollbar>
    </NPopover>
</template>
