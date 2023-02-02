<template>
  <WLGroupCardList :user-groups="groups"></WLGroupCardList>
</template>

<script setup lang="ts">
import { onBeforeMount, type Ref } from "vue";
import { storeToRefs } from "pinia";

import WLGroupCardList from "../WLGroupCardList.vue";

import type { WLUserGroup } from "@/types/wishlist.types";
import { useUserStore } from "@/stores/user";
import { initializeStateGroups } from "@/helpers/groups";

// TODO: split between accepted groups and invited/requested

const { groups }: { groups: Ref<Array<WLUserGroup>> } = storeToRefs(
  useUserStore()
);

onBeforeMount(async () => await initializeStateGroups());
</script>
