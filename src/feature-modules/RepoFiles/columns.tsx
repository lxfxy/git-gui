import { fileStatusIsHistory, fileStatusWorkspace } from "@/store";
import { gitRestore } from "@/utils";
import { FileStatus, fileStatusType, RepoWorkTree } from "@/utils/gitStatus";
import { DataTableColumns, NButton, NPopconfirm, NSelect } from "naive-ui";
import { TableBaseColumn } from "naive-ui/es/data-table/src/interface";
import { tw } from "@twind/core";
import { defineComponent, Prop, reactive, ref, toRefs } from "vue";
import Button from "../Branch/Button";
import Tag from "./Tag.vue";

const fileStatusOption = fileStatusType.map((item) => {
    return {
        label: item,
        value: item,
    };
});
const state = reactive<Record<string, { visible?: boolean }>>({});
export const columns = reactive<DataTableColumns<FileStatus>>([
    // {
    //     type: "selection",
    // },
    {
        key: "status",
        filterOptionValue: null,
        filterOptionValues: [],
        width: 120,
        title() {
            return (
                <div class={`flex items-center gap-x-[10px]`}>
                    <span>文件状态</span>
                </div>
            );
        },
        filter(value, data) {
            return value === data.status;
        },
        render(data) {
            return <Tag status={data.status} />;
        },
    },
    {
        key: "filename",
        title: "文件名",
        ellipsis: true,
        render(data) {
            return <code title={data.filename}>{data.filename}</code>;
        },
    },
    {
        key: "filepath",
        title: "文件路径",
        ellipsis: true,
        render(data) {
            return <code title={data.filepath}>{data.filepath}</code>;
        },
        width: "60%",
    },
    {
        title: "操作",
        key: "filename",
        render(data) {
            return <TableOperationCol data={data} />;
        },
    },
]);

export const tableStatusCol = columns[0] as TableBaseColumn<FileStatus>;
export const TableStatusColFilter = () => {
    return (
        <NSelect
            class={`w-[240px]`}
            options={fileStatusOption}
            clearable
            v-model:value={tableStatusCol.filterOptionValues}
            renderLabel={(data: any) => {
                return <Tag status={data.value} />;
            }}
            multiple
        ></NSelect>
    );
};

interface TableOperationColProps {
    data: FileStatus;
}
const TableOperationCol = defineComponent({
    props: {
        data: {
            type: Object as any,
            required: true,
        },
    },
    setup(props: TableOperationColProps) {
        const { data } = toRefs(props);
        const show = ref(false);
        const close = () => {
            show.value = false;
        };
        const discard = () => {
            gitRestore({
                file: data.value,
                staged: true,
                workspace: true,
            });
            close();
        };
        const restoreToWorkSpace = () => {
            gitRestore({
                file: data.value,
                staged: true,
            });
            close();
        };
        return () => {
            return (
                <div>
                    <NPopconfirm
                        positiveButtonProps={{ type: "error" }}
                        v-model:show={show.value}
                    >
                        {{
                            trigger() {
                                return <Button type="error">丢弃更改</Button>;
                            },
                            default() {
                                return (
                                    <div>确定要丢弃此文件的所有更改吗？</div>
                                );
                            },
                            action() {
                                return (
                                    <>
                                        <NButton size="small" onClick={close}>
                                            取消
                                        </NButton>
                                        {fileStatusIsHistory.value && (
                                            <NButton
                                                type="info"
                                                size="small"
                                                onClick={restoreToWorkSpace}
                                            >
                                                退回工作区
                                            </NButton>
                                        )}
                                        <NButton
                                            type="error"
                                            size="small"
                                            onClick={discard}
                                        >
                                            丢弃
                                        </NButton>
                                    </>
                                );
                            },
                        }}
                    </NPopconfirm>
                </div>
            );
        };
    },
});
