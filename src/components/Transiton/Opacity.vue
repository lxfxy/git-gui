<script setup lang="ts">
import { Transition, TransitionProps } from "vue";
interface TransitionOpacityProps extends TransitionProps {}
const props = defineProps<TransitionOpacityProps>();
</script>

<template>
    <Transition name="v-opacity" v-bind="props">
        <slot></slot>
    </Transition>
</template>
<style>
.v-opacity-enter-active,
.v-opacity-leave-active {
    transition: opacity 0.5s ease;
}
.v-opacity-enter-from {
    opacity: 0 !important;
}
.v-opacity-leave-to {
    opacity: 0 !important;
}
</style>
