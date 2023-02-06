<template>
  <WLActionCardList :actionCards="groupsActions"></WLActionCardList>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { storeToRefs } from "pinia";

import type { ActionCard } from "@/types/action-cards.types";
import { useGroupsStore } from "@/groups/store";

import WLActionCardList from "@/components/WLActionCardList.vue";

const { groupsActions }: { groupsActions: Ref<Array<ActionCard>> } =
  storeToRefs(useGroupsStore());
</script>
