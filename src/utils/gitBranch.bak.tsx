import { curRepoDir, repoBranchs, repoRemoteNames, repoRemotes } from "@/store";
import { commandErrorDialog, runCommand } from "./command";
import {
    FormInst,
    NAlert,
    NForm,
    NFormItem,
    NSelect,
    NCheckbox,
    NSpace,
    NButton,
    NTooltip,
    NTag,
    FormRules,
} from "naive-ui";
import { tw } from "twind";
import {
    computed,
    defineComponent,
    effect,
    FunctionalComponent,
    reactive,
    ref,
    watch,
} from "vue";
import { dialog } from "./globalApis";
import { GitRemotes } from "./gitRemote";
// import { repoRemoteNames } from "@/store/repoRemote";

const formatMap = {
    authorname: "authorname",
    current: "HEAD",
    name: "refname:lstrip=1",
    authordate: "authordate",
    upstream: "upstream:lstrip=2",
};
const formatKeys = Object.keys(formatMap) as any as (keyof typeof formatMap)[];
const formatValues = Object.values(formatMap);
export type GitBranch = typeof formatMap & {
    remotes?: boolean;
    heads?: boolean;
    /**
     * remote 名字
     */
    remote?: string;
    /**
     * 不包含 remote 的名字
     */
    branchname: string;
};
export const gitBranch = async (cwd: Cwd = curRepoDir.value) => {
    const format = `${formatValues
        .map((item) => {
            return `%(${item})`;
        })
        .join("\n")}`;
    const command = runCommand("git", ["branch", "-a", "--format", format], {
        cwd,
    });
    const child = await command.spawn();
    return new Promise<[GitBranch, GitBranch[]]>((resolve) => {
        let activeBranch: GitBranch;
        let chunks: string[][] = [];
        const branchs: GitBranch[] = [];
        command.stdout.on("data", (line: string) => {
            const index = chunks.length % formatKeys.length;
            let key = formatKeys[index];
            let value = line.trim();
            chunks.push([key, value]);
            if (index + 1 === formatKeys.length) {
                const branchInfo = Object.fromEntries(chunks) as GitBranch;
                branchInfo.name = branchInfo.name.replace(
                    /^(\w+)\/(.+)/,
                    ($0, $1: "heads" | "remotes", $2) => {
                        branchInfo[$1] = true;
                        return $2;
                    }
                );
                if (branchInfo.remotes) {
                    branchInfo.remote = repoRemoteNames.value.find((item) => {
                        return branchInfo.name.startsWith(`${item}/`);
                    })!;
                    branchInfo.branchname = branchInfo.name.replace(
                        branchInfo.remote! + "/",
                        ""
                    );
                } else {
                    branchInfo.branchname = branchInfo.name;
                }
                branchs.push(branchInfo);
                if (branchInfo.current) {
                    activeBranch = branchInfo;
                }
                chunks = [];
            }
        });
        command.on("close", () => {
            resolve([activeBranch, branchs]);
        });
    });
};

interface GitBranchDelOptions {
    cwd?: Cwd;
    branch: GitBranch;
    force?: boolean;
}
export const gitBranchDel = async ({
    cwd = curRepoDir.value,
    branch,
    force = false,
}: GitBranchDelOptions) => {
    const args = ["branch", "-d", branch.name];
    if (force) {
        args.push("-f");
    }
    const command = runCommand("git", args, { cwd });
    command.on("command-error", commandErrorDialog);
    return await command.execute();
};

export const branchDel = async (branch: GitBranch) => {
    dialog.value?.error({
        style: { width: "50vw" },
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick() {
            gitBranchDel({ branch });
        },
        title() {
            return (
                <div class={tw`ml-[6px]`}>
                    真的要删除分支
                    <code class={tw`mx-[6px]`}>{branch.name}</code>吗？
                </div>
            );
        },
        content() {
            return (
                <>
                    <NAlert type="info" bordered={false}>
                        不会影响远程仓库，只是本地仓库将不再有当前删除分支的信息。
                    </NAlert>
                </>
            );
        },
    });
};

export const createRemoteBranch = (
    branchname: string,
    remote: string
): GitBranch => {
    return {
        authordate: new Date().toString(),
        authorname: "",
        branchname,
        current: "",
        name: `${remote}/${branchname}`,
        upstream: "",
        remote: remote,
        remotes: true,
    };
};

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
                    <div class={tw`flex gap-x-[10px] items-center`}>
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
                            class={tw`mt-[20px]`}
                            rules={rules}
                        >
                            <FormItemRemote
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
                                                    class={tw`ml-[100px]`}
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
                            <NSpace class={tw`ml-[100px]`}>
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

const FormItemRemote = defineComponent({
    props: {
        remote: Object,
        remoteName: String,
        remoteBranchName: String,
    },

    emits: ["update:remote", "update:remoteName", "update:remoteBranchName"],
    setup(props, context) {
        const curBranchs = repoBranchs.value;
        const branchs = ref<GitBranch[]>([]);
        const remotes = Object.values(repoRemotes.value);
        let branchnames: string[] = [];
        context.emit("update:remoteName", remotes[0].name);
        watch(
            () => props.remoteName,
            (remote) => {
                const newBranchs = curBranchs.filter(
                    (item) => item.remotes && item.remote! === remote
                );
                branchs.value = newBranchs;
                branchnames = newBranchs.map((item) => item.branchname);
            },
            { immediate: true }
        );
        watch(
            () => props.remoteBranchName,
            (remoteBranchName) => {
                let remoteInfo: GitBranch;
                if (
                    remoteBranchName &&
                    branchnames.includes(remoteBranchName)
                ) {
                    remoteInfo = branchs.value.find((item) => {
                        return item.branchname === remoteBranchName;
                    })!;
                } else {
                    remoteInfo = createRemoteBranch(
                        remoteBranchName!,
                        props.remoteName!
                    );
                }
                context.emit("update:remote", remoteInfo);
            }
        );

        return () => {
            return (
                <NFormItem label="远程分支：" showFeedback={false} required>
                    <NFormItem class={tw`w-[200px]`} path="remoteName">
                        <NSelect
                            value={props.remoteName}
                            onUpdateValue={(...args) => {
                                context.emit("update:remoteName", ...args);
                            }}
                            options={remotes as any}
                            labelField="name"
                            valueField="name"
                            renderLabel={(option: GitRemotes) => {
                                return <code>{option.name}</code>;
                            }}
                        />
                    </NFormItem>

                    <NFormItem class={tw`flex-1`} path="remoteBranchName">
                        <NSelect
                            filterable
                            clearable
                            tag
                            value={props.remoteBranchName}
                            onUpdateValue={(...args) => {
                                context.emit(
                                    "update:remoteBranchName",
                                    ...args
                                );
                            }}
                            options={branchs.value}
                            labelField="branchname"
                            valueField="branchname"
                            renderLabel={(option: GitBranch) => {
                                return <code>{option.branchname}</code>;
                            }}
                        />
                    </NFormItem>
                </NFormItem>
            );
        };
    },
});
