import { curRepoBranch, repoBranchs, repoHeadsBranchs } from "@/store";
import {
    FormInst,
    FormRules,
    NButton,
    NCheckbox,
    NForm,
    NFormItem,
    NInput,
    NSpace,
    NSpin,
} from "naive-ui";
import { tw } from "twind";
import { effect, reactive, ref, watch } from "vue";
import {
    createHeadsBranch,
    FormItemRemoteBranch,
    girBranchUpstream,
    GitBranch,
    gitBranchCreate,
} from ".";
import { gitPushUpstream, gitSwitch, sleep } from "..";
import { gitCheckRefFormat } from "../gitCheckRefFormat";
import { dialog } from "../globalApis";

interface AddBranchOptions {
    anchor?: string;
}
export const addBranch = ({
    anchor = curRepoBranch.value?.name,
}: AddBranchOptions = {}) => {
    const formValue = reactive({
        remote: null as GitBranch | null,
        remoteName: "",
        remoteBranchName: "",
        branchName: "",
        checkout: false,
    });
    const loadings = reactive({
        branchName: false,
    });
    const form = ref<FormInst>();
    const rules: FormRules = {
        branchName: [
            {
                required: true,
                message: "请输入分支名",
                trigger: ["input", "blur"],
            },
            {
                async validator(_rule, value) {
                    loadings.branchName = true;
                    return new Promise<any>(async (resolve, reject) => {
                        await sleep(200);
                        await gitCheckRefFormat({
                            branchName: `refs/heads/${value}`,
                        })
                            .then(resolve)
                            .catch(() => {
                                reject("此分支名验证不通过，请使用其他的。");
                            });
                        loadings.branchName = false;
                    });
                },
            },
            {
                validator(_rule, value) {
                    const headsBranch = repoHeadsBranchs.value.find((item) => {
                        return item.name === value;
                    });
                    if (headsBranch) {
                        return Promise.reject("此分支已存在");
                    }
                    return true;
                },
            },
        ],
    };
    const submit = async () => {
        await form.value?.validate();
        const { branchName, checkout, remote } = formValue;
        const newBranch = createHeadsBranch(branchName);
        await gitBranchCreate({ branchName, anchor });
        if (checkout) {
            await gitSwitch(branchName);
        }
        close();
        if (remote) {
            // await girBranchUpstream({
            //     branchName,
            //     remoteBranchName: remote.name,
            // });
            gitPushUpstream({ branch: newBranch, remote });
        }
    };
    const close = () => {
        dialogReactive?.destroy();
    };
    const dialogReactive = dialog.value?.create({
        style: { width: "50vw" },
        title: "创建分支",
        content() {
            return (
                <NForm
                    ref={form}
                    model={formValue}
                    labelPlacement="left"
                    rules={rules}
                    requireMarkPlacement="left"
                    labelWidth={100}
                    class={tw`mt-[20px]`}
                >
                    <NFormItem path="branchName" first label="分支名：">
                        <NInput
                            v-model:value={formValue.branchName}
                            placeholder="请输入新的分支名"
                            clearable
                            loading={loadings.branchName}
                        ></NInput>
                    </NFormItem>
                    <FormItemRemoteBranch
                        v-model:remote={formValue.remote}
                        v-model:remoteBranchName={formValue.remoteBranchName}
                        v-model:remoteName={formValue.remoteName}
                    />
                    <NFormItem class={tw`ml-[100px]`}>
                        <NCheckbox v-model:checked={formValue.checkout}>
                            创建完成后是否切换到此分支
                        </NCheckbox>
                    </NFormItem>
                    <NSpace class={tw`ml-[100px]`}>
                        <NButton type="success" onClick={submit}>
                            确定
                        </NButton>
                        <NButton onClick={close}>取消</NButton>
                    </NSpace>
                </NForm>
            );
        },
    });
};
