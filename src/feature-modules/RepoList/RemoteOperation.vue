<script setup lang="ts">
import { contextmenuRemote, contextmenuRepo } from "@/store";
import { delRemote, addRemote } from "@/utils";
import { tw } from "@twind/core";
import Button from "../Branch/Button";
</script>

<template>
    <div v-if="contextmenuRemote" :class="`flex flex-col`">
        <Button.Danger
            @click="
                delRemote({
                    remote: contextmenuRemote!,
                    repo: contextmenuRepo!,
                })
            "
        >
            删除此仓库源
        </Button.Danger>
        <Button
            @click="
                addRemote({
                    repo: contextmenuRepo!,
                    remoteInfo: contextmenuRemote!,
                })
            "
        >
            修改此仓库源
        </Button>
    </div>
</template>
