<template>
  <WLGenericForm class="wl-form--fields-flex-column"></WLGenericForm>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, type Ref } from "vue";
import { storeToRefs } from "pinia";

import WLGenericForm from "@/components/WLGenericForm.vue";

import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/types/wishlist.types";
import { useUserStore } from "@/stores/user";
import { initializeStateGroups } from "@/helpers/groups";

const { groups }: { groups: Ref<Array<WLUserGroup>> } = storeToRefs(
  useUserStore()
);

const groupsFilteredByAdminRights = computed<Array<WLUserGroup>>(() =>
  groups.value.filter((g) => {
    if (g.admin) return { value: g.group.id, displayName: g.group.name };
  })
);

onBeforeMount(
  async () => await initializeStateGroups(WLGroupMembershipStatus.ACCEPTED)
);
</script>
