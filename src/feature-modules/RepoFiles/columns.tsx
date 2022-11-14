import { FileStatus, fileStatusType } from "@/utils/gitStatus";
import { DataTableColumns, NSelect } from "naive-ui";
import { TableBaseColumn } from "naive-ui/es/data-table/src/interface";
import { tw } from "twind";
import { reactive } from "vue";
import Tag from "./Tag.vue";

const fileStatusOption = fileStatusType.map((item) => {
    return {
        label: item,
        value: item,
    };
});
export const columns = reactive<DataTableColumns<FileStatus>>([
    {
        key: "status",
        filterOptionValue: null,
        filterOptionValues: [],
        title() {
            return (
                <div class={tw`flex items-center gap-x-[10px]`}>
                    <span>文件状态</span>
                    <NSelect
                        class={tw`flex-1`}
                        options={fileStatusOption}
                        clearable
                        v-model:value={this.filterOptionValues}
                        renderLabel={(data: any) => {
                            return <Tag status={data.value} />;
                        }}
                        multiple
                    ></NSelect>
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
        render(data) {
            return <code>{data.filename}</code>;
        },
    },
    {
        key: "filepath",
        title: "文件路径",
        render(data) {
            return <code>{data.filepath}</code>;
        },
    },
]);

export const tableStatusCol = columns[0] as TableBaseColumn<FileStatus>;
