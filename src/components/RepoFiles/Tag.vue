<script setup lang="ts">
import { FileStatusType } from "@/utils/repoFileStatus";
import { NTag } from "naive-ui";
interface Props extends Partial<NTagProps> {
    status: FileStatusType;
}
const props = defineProps<Props>();
const tagTypeMap: Record<FileStatusType, string> = {
    Delete: "error",
    Modify: "warning",
    New: "success",
};
</script>

<template>
    <NTag v-bind="props" :type="(tagTypeMap[props.status] as any)" size="small">
        {{ props.status }}
    </NTag>
</template>
