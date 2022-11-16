<script setup lang="ts">
import { writeText } from "@tauri-apps/api/clipboard";
import { getRepoLogMsg, repoLogsMsg } from "@/store";
import { GitLog } from "@/utils";
import { Copy } from "@vicons/ionicons5";
import { NButton, NIcon, NTime, NTooltip } from "naive-ui";
import { tw } from "twind";
import { computed, effect, toRefs } from "vue";
import { message } from "@/utils/globalApis";

interface BranchInfoProps {
    log: GitLog;
}
const props = defineProps<BranchInfoProps>();
const { log } = toRefs(props);
const hash = computed(() => {
    return props.log.Hash;
});
effect(() => {
    getRepoLogMsg(hash.value);
});
const copyHash = async () => {
    await writeText(hash.value);
    message.value?.success("复制成功");
};
</script>

<template>
    <div :class="tw`flex flex-col gap-y-[6px] relative`">
        <NTooltip>
            <template #trigger>
                <NButton
                    quaternary
                    :class="tw`absolute right-0 top-0`"
                    type="success"
                    @click="copyHash"
                >
                    <NIcon size="16px">
                        <Copy />
                    </NIcon>
                </NButton>
            </template>
            复制<code>Hash</code>信息
        </NTooltip>
        <div>
            提交人：<code>{{ log.Commiter }}</code>
        </div>
        <div>
            创建人：<code>{{ log.Author }}</code>
        </div>
        <div>
            提交日期：<code>
                {{ new Date(log.Date).toLocaleString() }}
                <NTime
                    :time="new Date(log.Date)"
                    :to="Date.now()"
                    type="relative"
                    :class="tw`text-color2`"
                />
            </code>
        </div>
        <div>提交消息：</div>
        <div
            v-html="repoLogsMsg[hash]?.join(`<br />`)"
            :class="tw`ml-[10px]`"
        ></div>
    </div>
</template>
