import { curRepoDir, repoBranchs, repoRemoteNames, repoRemotes } from "@/store";
import { runCommand } from "./command";
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
} from "naive-ui";
import { tw } from "twind";
import { effect, reactive, ref, watch } from "vue";
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

export const createRemoteBranch = (
    label: string,
    remote: string
): GitBranch => {
    return {
        authordate: new Date().toString(),
        authorname: "",
        branchname: label,
        current: "",
        name: `${remote}/${label}`,
        upstream: "",
        remote: remote,
        remotes: true,
    };
};

export interface ChooseBranchOptions {
    showInfo?: boolean;
    // dialog: ReturnType<typeof useDialog>;
    branch: string;
}
export interface ChooseBranchValue {
    branch: GitBranch;
    isUpstream: boolean;
}
export const chooseBranch = ({
    // dialog,
    showInfo = true,
    branch,
}: ChooseBranchOptions) => {
    return new Promise<ChooseBranchValue>((resolve) => {
        const curBranchs = repoBranchs.value;
        const branchs = ref<GitBranch[]>([]);
        let branchNames: string[] = [];
        const remotes = Object.values(repoRemotes.value);
        const formValue = reactive({
            remote: remotes[0].name,
            branch: "",
            isUpstream: false,
        });
        watch(
            () => formValue.remote,
            (remote) => {
                const newBranchs = curBranchs.filter(
                    (item) => item.remotes && item.remote! === remote
                );
                branchs.value = newBranchs;
                branchNames = newBranchs.map((item) => item.branchname);
            },
            { immediate: true }
        );
        const form = ref<FormInst>();
        const submit = async () => {
            await form.value?.validate();
            const branch = branchNames.includes(formValue.branch)
                ? branchs.value.find(
                      (item) => item.branchname === formValue.branch
                  )!
                : createRemoteBranch(formValue.branch, formValue.remote);
            dialogReactive.destroy();
            resolve({
                ...formValue,
                branch,
            });
        };
        const dialogReactive = dialog.value!.create({
            title: () => {
                return (
                    <>
                        选择<code>&nbsp;{branch}&nbsp;</code>分支推送的上游分支
                    </>
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
                        >
                            <NFormItem
                                label="远程分支："
                                showFeedback={false}
                                required
                            >
                                <NFormItem
                                    path="remote"
                                    rule={{
                                        required: true,
                                        message: "请选择推送源",
                                        trigger: ["input", "blur"],
                                    }}
                                    class={tw`w-[200px]`}
                                >
                                    <NSelect
                                        v-model:value={formValue.remote}
                                        options={remotes as any}
                                        labelField="name"
                                        valueField="name"
                                        renderLabel={(option: GitRemotes) => {
                                            return <code>{option.name}</code>;
                                        }}
                                    />
                                </NFormItem>

                                <NFormItem
                                    path="branch"
                                    rule={{
                                        required: true,
                                        message: "请选择上游分支",
                                        trigger: ["input", "blur"],
                                    }}
                                    class={tw`flex-1`}
                                >
                                    <NSelect
                                        filterable
                                        clearable
                                        tag
                                        v-model:value={formValue.branch}
                                        options={branchs.value}
                                        labelField="branchname"
                                        valueField="branchname"
                                        renderLabel={(option: GitBranch) => {
                                            return (
                                                <code>{option.branchname}</code>
                                            );
                                        }}
                                    />
                                </NFormItem>
                            </NFormItem>
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
