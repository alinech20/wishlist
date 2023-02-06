<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="inviteForm"
    @submitForm="inviteFriend"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from "vue";

import WLGenericForm from "@/components/WLGenericForm.vue";

import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/features/groups/types";
import type {
  WLButton,
  WLDropdownOption,
  WLField,
  WLForm,
} from "@/types/forms.types";

import { useGroupsStore } from "@/features/groups/store";
import { useAuthStore } from "@/features/auth/store";
import { initializeStateGroups } from "@/features/groups/helper";

// #region Groups the user's a part of
// accepted groups
const acceptedGroups = ref<Array<WLUserGroup>>([]);

/**
 * Get groups where user is admin
 */
const groupsFilteredByAdminRights = computed<Array<WLDropdownOption>>(() => {
  const filtered: Array<WLDropdownOption> = [];

  for (const group of acceptedGroups.value) {
    if (group.admin)
      filtered.push({
        optionValue: group.group.id as string,
        displayName: group.group.name,
      });
  }

  return filtered;
});
// #endregion

// #region Form to invite someone to a group
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
// #endregion

onBeforeMount(
  async () =>
    (acceptedGroups.value = await initializeStateGroups(
      WLGroupMembershipStatus.ACCEPTED
    ))
);

// #region Invite someone to a group logic
/**
 * Sends an invite to a person after checking if
 * the user exists and if it's already member of that group
 *
 * @param values Form values (group id and user email)
 * @param { Function } resetForm Function to reset the form
 */
async function inviteFriend(
  values: { group: string; friend: string },
  { resetForm }: { resetForm: Function }
): Promise<void> {
  const newEntry = { ...values };

  const { getUserByEmail }: { getUserByEmail: Function } = useAuthStore();
  const user = await getUserByEmail(newEntry.friend);

  if (user) {
    const {
      isUserInGroup,
      inviteToGroup,
    }: { isUserInGroup: Function; inviteToGroup: Function } = useGroupsStore();

    const alreadyMember = await isUserInGroup(user.userId, newEntry.group);
    if (!alreadyMember) {
      resetForm();
      await inviteToGroup(user.userId, newEntry.group);
    }
  }
}
// #endregion
</script>
