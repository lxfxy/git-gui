<script setup lang="ts">
import { Transition, TransitionProps } from "vue";
interface TransitionOpacityProps extends TransitionProps {}
const props = defineProps<TransitionOpacityProps>();
</script>

<template>
    <Transition name="opacity" v-bind="props">
        <slot></slot>
    </Transition>
</template>
<style>
.opacity-enter-active,
.opacity-leave-active {
    transition: opacity 0.5s ease;
}
.opacity-enter-from {
    opacity: 0 !important;
}
.opacity-leave-to {
    opacity: 0 !important;
}
</style>
