import Button from "@/components/Button.vue";
import { addLocalRepo } from "@/store";
import { open } from "@tauri-apps/api/dialog";
import { join } from "@tauri-apps/api/path";
import {
    FormInst,
    FormRules,
    NButton,
    NForm,
    NFormItem,
    NInput,
    NSpace,
} from "naive-ui";
import { mode, tw } from "twind";
import { reactive, ref, watch } from "vue";
import { gitClone } from ".";
import { dialog } from "../globalApis";

export interface CloneFormValue {
    name: string;
    url: string;
}
export const Clone = () => {
    return new Promise<void>(async (resolve, reject) => {
        const dir = (await open({
            directory: true,
            title: "选择目录存放仓库",
        })) as string;
        if (!dir) {
            reject();
            return;
        }
        const model = reactive<CloneFormValue>({
            name: "",
            url: "",
        });
        const rules: FormRules = {
            url: [
                {
                    required: true,
                    message: "请输入要克隆的仓库地址",
                    trigger: ["input", "blur"],
                },
                {
                    pattern: /^.+\.git$/,
                    message: "请输入正确的仓库地址 xxx.git",
                    trigger: ["input", "blur"],
                },
            ],
        };
        const form = ref<FormInst>();
        const cloneing = ref(false);
        const submit = async () => {
            await form.value?.validate();
            try {
                cloneing.value = true;
                const name =
                    model.name || model.url.replace(/.+\/(.+)\.git$/, "$1");
                await gitClone({
                    repoUrl: model.url,
                    name,
                    cwd: dir,
                });
                addLocalRepo([await join(dir, name)]);
                resolve();
            } catch (error) {
                reject();
            } finally {
                cloneing.value = false;
                close();
            }
        };
        const close = () => {
            dialogReactive?.destroy();
        };
        const dialogReactive = dialog.value?.info({
            style: { width: "50vw" },
            title() {
                return <div class={tw`ml-[10px]`}>克隆仓库</div>;
            },
            content() {
                return (
                    <div>
                        <NForm
                            ref={form}
                            labelPlacement="left"
                            requireMarkPlacement="left"
                            model={model}
                            rules={rules}
                            labelWidth={100}
                            class={tw`mt-[20px]`}
                        >
                            <NFormItem path="url" label="仓库地址" first>
                                <NInput v-model:value={model.url} />
                            </NFormItem>
                            <NFormItem path="name" label="文件夹名">
                                <NInput v-model:value={model.name} />
                            </NFormItem>
                            <NSpace class={tw`ml-[100px]`}>
                                <NButton
                                    type="success"
                                    onClick={submit}
                                    loading={cloneing.value}
                                >
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
