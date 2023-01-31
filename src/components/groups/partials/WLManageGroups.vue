<template>
  <WLGroupCardList :user-groups="groups"></WLGroupCardList>
</template>

<script setup lang="ts">
import { onBeforeMount, type Ref } from "vue";

import WLGroupCardList from "../WLGroupCardList.vue";

import type { WLUser } from "@/types/auth.types";
import type { WLUserGroup } from "@/types/wishlist.types";

import { useAuthStore } from "@/stores/auth";
import { useGroupsStore } from "@/stores/groups";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const {
  groups,
  groupsInitialized,
}: { groups: Ref<Array<WLUserGroup>>; groupsInitialized: Ref<boolean> } =
  storeToRefs(useUserStore());

onBeforeMount(async () => {
  const { getLoggedUser }: { getLoggedUser: WLUser | false } = useAuthStore();
  const { fetchUserGroups }: { fetchUserGroups: Function } = useGroupsStore();
  const {
    setGroups,
    setGroupsInitialized,
  }: {
    setGroups: Function;
    setGroupsInitialized: Function;
  } = useUserStore();

  if (getLoggedUser && getLoggedUser.uid && !groupsInitialized.value) {
    const userGroups = await fetchUserGroups(getLoggedUser.uid);
    setGroups(userGroups);
    setGroupsInitialized(true);
  }
});
</script>
