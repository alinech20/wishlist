<template>
  <article class="wl-manage-groups">
    <section
      v-if="accepted.length > 0"
      class="wl-manage-groups__section groups-member"
    >
      <h2 class="heading heading--s wl-manage-groups__section-title">
        Your groups ({{ accepted.length }})
      </h2>
      <WLGroupCardList :user-groups="accepted"></WLGroupCardList>
    </section>
    <section
      v-if="invitations.length > 0"
      class="wl-manage-groups__section groups-invitations"
    >
      <h2 class="heading heading--s wl-manage-groups__section-title">
        Pending invitations ({{ invitations.length }})
      </h2>
      <WLGroupCardList :user-groups="invitations"></WLGroupCardList>
    </section>
    <section
      v-if="requested.length > 0"
      class="wl-manage-groups__section groups-requests"
    >
      <h2 class="heading heading--s wl-manage-groups__section-title">
        Sent requests ({{ requested.length }})
      </h2>
      <WLGroupCardList :user-groups="requested"></WLGroupCardList>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, type Ref } from "vue";
import { storeToRefs } from "pinia";

import WLGroupCardList from "@/features/groups/components/WLGroupCardList.vue";

import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/features/groups/types";
import { useUserStore } from "@/stores/user";
import { initializeStateGroups } from "@/features/groups/helper";

// all groups
const { groups }: { groups: Ref<Array<WLUserGroup>> } = storeToRefs(
  useUserStore()
);

// #region Groups filtering getters
/**
 * Gets the groups based on the user's membership status
 *
 * @param { WLGroupMembershipStatus } status Status to filter by
 * @returns { Array<WLUserGroup> } Filtered groups
 */
const getGroupsFilteredByUserStatus = computed<
  (status: WLGroupMembershipStatus) => Array<WLUserGroup>
>(
  () =>
    (status: WLGroupMembershipStatus): Array<WLUserGroup> =>
      groups.value.filter((g) => g.status === status)
);

/**
 * Gets the groups where the user's an accepted member
 */
const accepted = computed(() =>
  getGroupsFilteredByUserStatus.value(WLGroupMembershipStatus.ACCEPTED)
);

/**
 * Gets the groups where the user's been invited to be a part of
 */
const invitations = computed(() =>
  getGroupsFilteredByUserStatus.value(WLGroupMembershipStatus.INVITED)
);

/**
 * Gets the groups where the user sent a join request
 */
const requested = computed(() =>
  getGroupsFilteredByUserStatus.value(WLGroupMembershipStatus.REQUESTED)
);
// #endregion

onBeforeMount(async () => await initializeStateGroups());
</script>

<style lang="scss">
@use "@/features/groups/assets/styles/partials/wl-manage-groups.scss";
</style>
