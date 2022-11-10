import axios from "./axios";

export interface GetGitMoji {
    gitmojis: GitMoji[];
}
export interface GitMoji {
    emoji: string;
    entity: string;
    code: string;
    description: string;
    name: string;
}
export const getGitMoji = async () => {
    const emojis = await axios.get<GetGitMoji>(
        "https://raw.githubusercontent.com/Jeff-Tian/gitmoji/i18n/cn/src/data/zh-CN/gitmojis.json"
    );
    return emojis.data;
};
