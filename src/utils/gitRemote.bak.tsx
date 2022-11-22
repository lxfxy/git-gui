import {
    curRepoDir,
    getRemotes,
    repoHeadsBranchs,
    RepoInfo,
    repoRemotesBranchs,
    setRepoStatus,
} from "@/store";
import {
    FormInst,
    FormRules,
    NButton,
    NForm,
    NFormItem,
    NInput,
    NSpace,
} from "naive-ui";
import { tw } from "twind";
import { reactive, ref } from "vue";
import { commandErrorDialog, runCommand } from "./command";
import { gitBranchCreate } from "./gitBranch";
import { dialog } from "./globalApis";

export interface GitRemoteUrl {
    url: string;
    name: string;
    type: string;
}
export interface GitRemote {
    name: string;
    fetch: GitRemoteUrl;
    push: GitRemoteUrl;
    urls: GitRemoteUrl[];
}
export const gitRemote = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "-v"], { cwd });
    await command.spawn();
    return new Promise<Record<string, GitRemote>>((resolve) => {
        const result: Record<string, GitRemote> = {};
        command.stdout.on("data", (remoteInfo) => {
            const [, name, url, type] = /(.+?)\s+(.+?)\s\((\w+)\)/.exec(
                remoteInfo
            )!;
            const info = {
                name,
                url,
                type,
            };
            result[name] = result[name] || { name, urls: [] };
            result[name][type as "fetch" | "push"] = info;
            result[name].urls.push(info);
        });
        command.on("close", () => {
            resolve(result);
        });
    });
};

export const gitRemoteUpdate = async (cwd: Cwd = curRepoDir.value) => {
    const command = runCommand("git", ["remote", "update"], { cwd });
    setRepoStatus({ isRemoteRefetching: true });
    const child = await command.execute();
    const newRemotes = await gitRemote();
    const curHeadsBranchs = repoHeadsBranchs.value;
    // for (const remoteBranch of repoRemotesBranchs.value) {
    //     if (remoteBranch.branchname === "HEAD") {
    //         continue;
    //     }
    //     const isExits = curHeadsBranchs.find((item) => {
    //         return item.branchname === remoteBranch.branchname;
    //     });
    //     if (isExits) {
    //     } else {
    //         await gitBranchCreate({
    //             branchName: remoteBranch.branchname,
    //             anchor: remoteBranch.name,
    //         });
    //     }
    // }
    setRepoStatus({ isRemoteRefetching: false });
};

interface GitRemoteDelOptions {
    cwd?: Cwd;
    remoteName: string;
}
export const gitRemoteDel = async ({
    cwd,
    remoteName,
}: GitRemoteDelOptions) => {
    const command = runCommand("git", ["remote", "remove", remoteName], {
        cwd,
    });
    command.on("command-error", commandErrorDialog);
    await command.exec();
};

export interface GitRemoteAddOptions {
    cwd?: Cwd;
    name: string;
    url: string;
}
export const gitRemoteAdd = async ({
    cwd = curRepoDir.value,
    name,
    url,
}: GitRemoteAddOptions) => {
    const command = runCommand("git", ["remote", "add", name, url], { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.exec();
};

interface DelRemoteOptions {
    repo: RepoInfo;
    remote: GitRemote;
}
export const delRemote = ({ remote, repo }: DelRemoteOptions) => {
    return new Promise<void>((resolve, reject) => {
        dialog.value?.warning({
            title() {
                return <div>删除远程仓库源</div>;
            },
            negativeButtonProps: { size: "large" },
            positiveButtonProps: { size: "large" },
            positiveText: "确定",
            negativeText: "取消",
            onPositiveClick() {
                gitRemoteDel({ remoteName: remote.name, cwd: repo.dir });
                resolve();
            },
            onNegativeClick: reject,
            content() {
                return (
                    <div>
                        是否要删除 <code>{repo.dir}</code> 的{" "}
                        <code>{remote.name}</code>
                    </div>
                );
            },
        });
    });
};

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
                type: "url",
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
            } else {
                gitRemoteAdd({
                    ...model,
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
                        创建
                        <code class={tw`mx-[6px]`}>{repo.title}</code>
                        仓库的源
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
