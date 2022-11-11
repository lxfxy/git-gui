<script setup lang="tsx">
import { curRepo } from "@/store/repo";
import {
    FileStatusType,
    historyRepoFiles,
    RepoWorkTree,
    FileStatus,
} from "@/utils/gitStatus";
import { repoWorkTreeInfo } from "@/store/repoFileStatus";
import {
    NButton,
    NDataTable,
    NPopselect,
    NSpace,
    NTag,
    useMessage,
} from "naive-ui";
import { apply, tw } from "twind";
import { computed, ref } from "vue";
import { css } from "twind/css";
import { columns } from "./columns";
const genCss = (status: FileStatusType) => {
    return css`
        .n-data-table-td {
            background-color: var(
                --file-status-${status.toLocaleLowerCase()}-bg-color
            ) !important;
            color: var(--file-status-${status.toLocaleLowerCase()}-text-color);
        }
    `;
};
const rowClassName: Record<FileStatusType, any> = {
    Modify: genCss("Modify"),
    Delete: genCss("Delete"),
    New: genCss("New"),
};
const workTreeTypeOptions = [
    { label: "工作区", value: RepoWorkTree.Workspace },
    { label: "暂存区", value: RepoWorkTree.History },
];
const workTreeTypeValueMap = {
    [RepoWorkTree.Workspace]: "工作区",
    [RepoWorkTree.History]: "暂存区",
};
const message = useMessage();
const workspace = ref<RepoWorkTree>(RepoWorkTree.Workspace);
const tableData = computed(() => {
    return repoWorkTreeInfo[workspace.value].value;
});
const pushHistory = async () => {
    await historyRepoFiles();
    message.success("暂存完成！");
};
const tableClassName = css`
    .n-data-table {
        ${apply`flex-1 overflow-hidden`}
    }
    .n-data-table-wrapper {
        ${apply`flex-1 overflow-hidden`}
    }
    .n-data-table-base-table {
        ${apply`flex flex-col overflow-hidden`};
    }
    .n-data-table-base-table-body {
        ${apply`flex-1 overflow-hidden`};
    }
`;
</script>

<template>
    <div
        :class="[
            tw`text-color1 flex-1 flex flex-col h-[600px] ${tableClassName} overflow-hidden`,
        ]"
    >
        <div
            v-if="curRepo"
            :class="tw`title flex items-center justify-between h-[50px]`"
        >
            <div :class="[tw`flex gap-x-[10px] items-center`]">
                <div>
                    <code>{{ curRepo.title }}</code> 的工作树信息
                </div>
                <NPopselect
                    :options="workTreeTypeOptions"
                    v-model:value="workspace"
                >
                    <NTag type="info" size="small">
                        {{ workTreeTypeValueMap[workspace] }}
                    </NTag>
                </NPopselect>
            </div>
            <NSpace
                v-if="tableData.length && workspace === RepoWorkTree.Workspace"
                :align="'center'"
            >
                <NButton type="success" @click="pushHistory" quaternary>
                    暂存所有更改
                </NButton>
            </NSpace>
        </div>
        <div v-else :class="tw`title h-[50px]`">未选择仓库</div>
        <NDataTable
            :bordered="true"
            :columns="columns"
            :data="tableData"
            :max-height="'100%'"
            :row-class-name="(data: FileStatus) => {
                return tw`${rowClassName[data.status]}`
            }"
            size="small"
        ></NDataTable>
    </div>
</template>
