import { RepoInfo } from "@/store";
import { GitRemote, gitRemoteDel } from ".";
import { dialog } from "../globalApis";

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
