<script setup lang="ts">
import { Transition } from "vue";
</script>

<template>
    <Transition name="opacity">
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
