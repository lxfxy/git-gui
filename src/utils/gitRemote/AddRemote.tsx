import { RepoInfo } from "@/store";
import {
    FormRules,
    FormInst,
    NForm,
    NFormItem,
    NInput,
    NSpace,
    NButton,
} from "naive-ui";
import { tw } from "twind";
import { reactive, ref } from "vue";
import { GitRemote, gitRemoteAdd, gitRemoteRename, gitRemoteSetUrl } from ".";
import { dialog } from "../globalApis";

export interface AddRemoteOptions {
    remoteInfo?: GitRemote;
    repo: RepoInfo;
}
export interface AddRemoteFormValue {
    name: string;
    url: string;
}
export const addRemote = ({ remoteInfo, repo }: AddRemoteOptions) => {
    return new Promise((resolve, reject) => {
        const model = reactive<AddRemoteFormValue>({
            name: remoteInfo?.name || "",
            url: remoteInfo?.urls[0].url || "",
        });
        const rules: FormRules = {
            name: {
                required: true,
                trigger: ["input", "blur"],
                message: "请输入新的源的名字",
            },
            url: {
                required: true,
                trigger: ["input", "blur"],
                message: "请输入新的源的仓库地址",
            },
        };
        const form = ref<FormInst>();
        const close = () => {
            dialogReactive?.destroy();
        };
        const submit = async () => {
            await form.value?.validate();
            if (remoteInfo) {
                if (remoteInfo.urls[0].url !== model.url) {
                    await gitRemoteSetUrl({
                        remoteName: remoteInfo.name,
                        url: model.url,
                    });
                }
                if (remoteInfo.name !== model.name) {
                    await gitRemoteRename({
                        remoteName: remoteInfo.name,
                        newRemoteName: model.name,
                    });
                }
            } else {
                gitRemoteAdd({
                    name: model.name,
                    url: model.url,
                    cwd: repo.dir,
                });
            }
            close();
        };
        const dialogReactive = dialog.value?.info({
            style: {
                width: "50vw",
            },
            title() {
                return (
                    <div class={tw`ml-[6px]`}>
                        {remoteInfo ? "修改" : "创建"}
                        <code class={tw`mx-[6px]`}>{repo.title}</code>
                        仓库的源
                        {remoteInfo && (
                            <code class={tw`mx-[6px]`}>{remoteInfo?.name}</code>
                        )}
                    </div>
                );
            },
            content() {
                return (
                    <div>
                        <NForm
                            ref={form}
                            model={model}
                            labelPlacement="left"
                            requireMarkPlacement="left"
                            rules={rules}
                            labelWidth={100}
                            class={tw`mt-[20px]`}
                        >
                            <NFormItem label="名字" path="name">
                                <NInput v-model:value={model.name} />
                            </NFormItem>
                            <NFormItem label="地址" path="url">
                                <NInput v-model:value={model.url} />
                            </NFormItem>
                            <NSpace class={tw`ml-[100px]`}>
                                <NButton type="success" onClick={submit}>
                                    确定
                                </NButton>
                                <NButton onClick={close}>取消</NButton>
                            </NSpace>
                        </NForm>
                    </div>
                );
            },
        });
    });
};
