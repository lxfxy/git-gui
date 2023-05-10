<script setup lang="ts">
import { NButton, ButtonProps, NIcon, NSpin } from "naive-ui";
import { tw } from "@twind/core";
import { toRefs } from "vue";
import Opacity from "./Transiton/Opacity.vue";

interface Button extends ButtonProps {
    loading?: boolean;
}
const propsRaw = defineProps<Button>();
const { loading, ...props } = toRefs(propsRaw);
</script>

<template>
    <NButton v-bind="(props as ButtonProps)">
        <Opacity mode="out-in">
            <NSpin
                v-if="loading"
                :class="`w-[20px] h-[20px] opacity-100`"
            ></NSpin>
            <template v-else>
                <slot name="icon"></slot>
                <slot></slot>
            </template>
        </Opacity>
    </NButton>
</template>
