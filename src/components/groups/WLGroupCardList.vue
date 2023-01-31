<template>
  <article class="wl-group-cards-wrapper">
    <WLGroupCard
      v-for="group in props.userGroups"
      :key="group.group.id"
      v-bind="group"
    ></WLGroupCard>
  </article>
</template>

<script setup lang="ts">
import type { WLUserGroup } from "@/types/wishlist.types";
import WLGroupCard from "./WLGroupCard.vue";

const props = defineProps<{
  userGroups: Array<WLUserGroup> | undefined;
}>();
</script>
