<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="inviteForm"
    @submitForm="inviteFriend"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, type Ref } from "vue";
import { storeToRefs } from "pinia";

import WLGenericForm from "@/components/WLGenericForm.vue";

import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/types/wishlist.types";
import type {
  WLButton,
  WLDropdownOption,
  WLField,
  WLForm,
} from "@/types/forms.types";

import { useUserStore } from "@/stores/user";
import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth";

import { initializeStateGroups } from "@/helpers/groups";

const { groups }: { groups: Ref<Array<WLUserGroup>> } = storeToRefs(
  useUserStore()
);

const groupsFilteredByAdminRights = computed<Array<WLDropdownOption>>(() => {
  const filtered: Array<WLDropdownOption> = [];

  for (const group of groups.value) {
    if (group.admin)
      filtered.push({
        optionValue: group.group.id as string,
        displayName: group.group.name,
      });
  }

  return filtered;
});

const inviteForm = reactive<WLForm>({
  id: "InviteToGroup",
  title: "Invite friends",
  validationSchema: {},
  fields: [
    {
      key: "group",
      labelText: "Choose group",
      fieldElement: "select",
      name: "group",
      required: true,
      options: computed(() => groupsFilteredByAdminRights.value),
      placeholder: "",
    } as WLField,
    {
      key: "add-friend",
      type: "email",
      name: "friend",
      required: true,
      placeholder: "Friend's email...",
    } as WLField,
  ] as Array<WLField>,
  buttons: [
    {
      key: "invite-button",
      form: "InviteToGroup",
      name: "invite",
      type: "submit",
      text: "Invite",
      xClasses: "wl-button--primary",
    } as WLButton,
    {
      key: "reset-form-button",
      form: "InviteToGroup",
      name: "reset-form",
      type: "reset",
      text: "Reset form",
      xClasses: "wl-button--secondary",
    } as WLButton,
  ] as Array<WLButton>,
});

onBeforeMount(
  async () => await initializeStateGroups(WLGroupMembershipStatus.ACCEPTED)
);

async function inviteFriend(
  values: { group: string; friend: string },
  { resetForm }: { resetForm: Function }
): Promise<void> {
  const newEntry = { ...values };
  resetForm();

  const { getUserByEmail }: { getUserByEmail: Function } = useAuthStore();
  const user = await getUserByEmail(newEntry.friend);

  if (user) {
    const {
      isUserInGroup,
      inviteToGroup,
    }: { isUserInGroup: Function; inviteToGroup: Function } = useGroupsStore();

    const alreadyMember = await isUserInGroup(user.userId, newEntry.group);
    if (!alreadyMember) await inviteToGroup(user.userId, newEntry.group);
  }
}
</script>
