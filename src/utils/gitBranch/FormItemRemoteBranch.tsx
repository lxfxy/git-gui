import { repoBranchs, repoRemotes } from "@/store";
import { NFormItem, NSelect, FormItemProps } from "naive-ui";
import { tw } from "twind";
import { defineComponent, ref, toRefs, watch } from "vue";
import { GitBranch, createRemoteBranch } from ".";
import { GitRemotes } from "../gitRemote";
export const FormItemRemoteBranch = defineComponent({
    props: {
        remote: Object,
        remoteName: String,
        remoteBranchName: String,
        required: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:remote", "update:remoteName", "update:remoteBranchName"],
    setup(props, context) {
        const curBranchs = repoBranchs.value;
        const branchs = ref<GitBranch[]>([]);
        const remotes = Object.values(repoRemotes.value);
        let branchnames: string[] = [];
        context.emit("update:remoteName", remotes[0].name);
        const { required } = toRefs(props);
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
                <NFormItem
                    label="远程分支："
                    showFeedback={false}
                    showRequireMark={required.value}
                >
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
                            style={{ borderTopRightRadius: 0 }}
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
