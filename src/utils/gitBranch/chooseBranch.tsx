import {
    FormInst,
    FormRules,
    NTag,
    NAlert,
    NForm,
    NFormItem,
    NTooltip,
    NCheckbox,
    NSpace,
    NButton,
} from "naive-ui";
import { tw } from "@twind/core";
import { reactive, ref } from "vue";
import { GitBranch } from ".";
import { dialog } from "../globalApis";
import { FormItemRemoteBranch } from "./FormItemRemoteBranch";

export interface ChooseBranchOptions {
    showInfo?: boolean;
    // dialog: ReturnType<typeof useDialog>;
    branch: string;
    force?: boolean;
}
export interface ChooseBranchValue {
    branch: GitBranch;
    isUpstream: boolean;
}
export const chooseBranch = ({
    // dialog,
    showInfo = true,
    branch,
    force = false,
}: ChooseBranchOptions) => {
    return new Promise<ChooseBranchValue>((resolve) => {
        const formValue = reactive({
            remote: null as any as GitBranch,
            remoteName: "",
            remoteBranchName: "",
            isUpstream: false,
        });
        const form = ref<FormInst>();
        const rules: FormRules = {
            remoteBranchName: {
                required: true,
                message: "请选择上游分支",
                trigger: ["input", "blur"],
            },
            remoteName: {
                required: true,
                message: "请选择远程仓库",
                trigger: ["input", "blur"],
            },
        };
        const submit = async () => {
            await form.value?.validate();
            dialogReactive.destroy();
            resolve({
                branch: formValue.remote,
                isUpstream: formValue.isUpstream,
            });
        };
        const dialogReactive = dialog.value!.create({
            title: () => {
                return (
                    <div class={`flex gap-x-[10px] items-center`}>
                        <div>
                            选择<code>&nbsp;{branch}&nbsp;</code>
                            分支推送的上游分支
                        </div>
                        {force && <NTag type="error">强制推送</NTag>}
                    </div>
                );
            },
            showIcon: false,
            style: { width: "50vw" },
            content() {
                return (
                    <>
                        {showInfo && (
                            <NAlert type="info">
                                因为本分支
                                <code>&nbsp;{branch}&nbsp;</code>
                                没有关联上游分支(远程分支)，现在请选择一个上游分支进行推送。
                            </NAlert>
                        )}
                        <NForm
                            model={formValue}
                            ref={form}
                            labelPlacement="left"
                            labelWidth={100}
                            requireMarkPlacement="left"
                            class={`mt-[20px]`}
                            rules={rules}
                        >
                            <FormItemRemoteBranch
                                required
                                v-model:remote={formValue.remote}
                                v-model:remoteBranchName={
                                    formValue.remoteBranchName
                                }
                                v-model:remoteName={formValue.remoteName}
                            />
                            <NFormItem>
                                <NTooltip>
                                    {{
                                        trigger() {
                                            return (
                                                <NCheckbox
                                                    v-model:checked={
                                                        formValue.isUpstream
                                                    }
                                                    class={`ml-[100px]`}
                                                >
                                                    关联此上游分支
                                                </NCheckbox>
                                            );
                                        },
                                        default() {
                                            return (
                                                <>
                                                    关联上游分支以后，就可以直接推送了哦
                                                </>
                                            );
                                        },
                                    }}
                                </NTooltip>
                            </NFormItem>
                            <NSpace class={`ml-[100px]`}>
                                <NButton type="primary" onClick={submit}>
                                    确定
                                </NButton>
                                <NButton onClick={dialogReactive.destroy}>
                                    取消
                                </NButton>
                            </NSpace>
                        </NForm>
                    </>
                );
            },
        });
    });
};
