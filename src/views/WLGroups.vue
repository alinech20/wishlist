<template>
  <WLBaseLayout>
    <WLActionCardList
      :actionCards="groupsActions"
      v-show="showActionCardList"
    ></WLActionCardList>
    <WLCreateGroup v-show="showCreateGroupPartial"></WLCreateGroup>
    <WLJoinGroup v-show="showJoinGroupPartial"></WLJoinGroup>

    <!-- using v-if to delay the mount for the logic in onBeforeMount -->
    <WLManageGroups v-if="showManageGroupsPartial"></WLManageGroups>
  </WLBaseLayout>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue";
import { storeToRefs } from "pinia";

import type { ActionCard } from "@/types/action-cards.types";
import { useGroupsStore } from "@/stores/groups";

import WLBaseLayout from "@/layouts/WLBaseLayout.vue";
import WLActionCardList from "@/components/WLActionCardList.vue";
import WLCreateGroup from "@/components/groups/partials/WLCreateGroup.vue";
import WLJoinGroup from "@/components/groups/partials/WLJoinGroup.vue";
import WLManageGroups from "@/components/groups/partials/WLManageGroups.vue";

const {
  groupsActions,
  activeView,
}: { groupsActions: Ref<Array<ActionCard>>; activeView: Ref<string> } =
  storeToRefs(useGroupsStore());

const showActionCardList = computed<boolean>(() => activeView.value === "home");
const showCreateGroupPartial = computed<boolean>(
  () => activeView.value === "create"
);
const showJoinGroupPartial = computed<boolean>(
  () => activeView.value === "join"
);
const showManageGroupsPartial = computed<boolean>(
  () => activeView.value === "manage"
);
</script>
