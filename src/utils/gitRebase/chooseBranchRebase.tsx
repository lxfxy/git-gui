import { repoHeadsBranchs } from "@/store";
import {
    FormInst,
    FormRules,
    NButton,
    NForm,
    NFormItem,
    NSelect,
    NSpace,
} from "naive-ui";
import { tw } from "twind";
import { reactive, ref } from "vue";
import { GitBranch, gitRebase } from "..";
import { dialog } from "../globalApis";

interface ChooseBranchRebaseOptions {
    branch: GitBranch;
}
export const chooseBranchRebase = ({ branch }: ChooseBranchRebaseOptions) => {
    return new Promise((resolve) => {
        const model = reactive({
            branch: "",
        });
        const rules: FormRules = {
            branch: {
                message: "请选择要变基的分支",
                required: true,
                trigger: ["input", "", "blur"],
            },
        };
        const branchs = repoHeadsBranchs.value.filter((item) => {
            return item.name !== branch.name;
        });
        const form = ref<FormInst>();
        const submit = async () => {
            await form.value?.validate();
            gitRebase({ target: branch.name, branch: model.branch });
            dialogReactive?.destroy();
        };
        const dialogReactive = dialog.value?.info({
            title() {
                return (
                    <div class={tw`ml-[10px]`}>
                        选择&nbsp;<code>{branch.name}</code>&nbsp;要变基的分支
                    </div>
                );
            },
            content() {
                return (
                    <div>
                        <NForm
                            model={model}
                            labelPlacement="left"
                            labelWidth={100}
                            class={tw`mt-[20px]`}
                            rules={rules}
                            ref={form}
                        >
                            <NFormItem label="分支：" path="branch">
                                <NSelect
                                    options={branchs}
                                    v-model:value={model.branch}
                                    labelField="name"
                                    valueField="name"
                                ></NSelect>
                            </NFormItem>
                            <NSpace class={tw`ml-[100px]`}>
                                <NButton type="success" onClick={submit}>
                                    确定
                                </NButton>
                                <NButton>取消</NButton>
                            </NSpace>
                        </NForm>
                    </div>
                );
            },
        });
    });
};
