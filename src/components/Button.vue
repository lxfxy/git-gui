<script setup lang="ts">
import { NButton, ButtonProps, NIcon, NSpin } from "naive-ui";
import { tw } from "twind";
import { toRefs } from "vue";
import Opacity from "./Transiton/Opacity.vue";

interface Button extends ButtonProps {
    loading?: boolean;
}
const propsRaw = defineProps<Button>();
const { loading, ...props } = toRefs(propsRaw);
</script>

<template>
    <NButton v-bind="(props as ButtonProps)" :class="tw`opacity-100!`">
        <Opacity mode="out-in">
            <NSpin
                v-if="loading"
                :class="tw`w-[20px] h-[20px] opacity-100`"
            ></NSpin>
            <slot name="icon" v-else></slot>
        </Opacity>
        <slot></slot>
    </NButton>
</template>
