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

import WLGroupCardList from "../WLGroupCardList.vue";

import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/types/wishlist.types";
import { useUserStore } from "@/stores/user";
import { initializeStateGroups } from "@/helpers/groups";

// all groups
const { groups }: { groups: Ref<Array<WLUserGroup>> } = storeToRefs(
  useUserStore()
);

const filterGroups = computed<
  (status: WLGroupMembershipStatus) => Array<WLUserGroup>
>(
  () =>
    (status: WLGroupMembershipStatus): Array<WLUserGroup> =>
      groups.value.filter((g) => g.status === status)
);

const accepted = computed(() =>
  filterGroups.value(WLGroupMembershipStatus.ACCEPTED)
);

const invitations = computed(() =>
  filterGroups.value(WLGroupMembershipStatus.INVITED)
);

const requested = computed(() =>
  filterGroups.value(WLGroupMembershipStatus.REQUESTED)
);

onBeforeMount(async () => await initializeStateGroups());
</script>

<style lang="scss">
@use "@/assets/styles/components/groups/partials/wl-manage-groups.scss";
</style>
