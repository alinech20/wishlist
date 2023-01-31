<template>
  <WLBaseLayout>
    <WLActionCardList
      :actionCards="groupsActions"
      v-if="showActionCardList"
    ></WLActionCardList>
    <WLCreateGroup v-else-if="showCreateGroupPartial"></WLCreateGroup>
    <WLJoinGroup v-else-if="showJoinGroupPartial"></WLJoinGroup>
    <WLInvite v-else-if="showInvitePartial"></WLInvite>
    <WLManageGroups v-else-if="showManageGroupsPartial"></WLManageGroups>
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
import WLInvite from "@/components/groups/partials/WLInvite.vue";
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
const showInvitePartial = computed<boolean>(
  () => activeView.value === "invite"
);
const showManageGroupsPartial = computed<boolean>(
  () => activeView.value === "manage"
);
</script>
