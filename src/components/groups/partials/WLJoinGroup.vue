<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="getJoinGroupForm"
    @submitForm="joinExistingGroup"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { computed, reactive, type Ref } from "vue";
import { getISOFormattedCurrentDateTime } from "@/helpers/date";

import type { WLUser } from "@/types/auth.types";
import type { WLButton, WLField, WLForm } from "@/types/forms.types";

import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth";

import WLGenericForm from "../../WLGenericForm.vue";
import { storeToRefs } from "pinia";
import { WLGroupMembershipStatus } from "@/types/wishlist.types";

// #region Join existing group form data and getter
const joinGroupForm = reactive<WLForm>({
  id: "JoinGroup",
  title: "Join a group",
  validationSchema: {},
  fields: [
    {
      key: "id",
      type: "text",
      name: "id",
      required: true,
      placeholder: "Group ID...",
    } as WLField,
  ] as Array<WLField>,
  buttons: [
    {
      key: "join-group-button",
      form: "JoinGroup",
      name: "join-group",
      type: "submit",
      text: "Join group",
      xClasses: "wl-button--primary-dark",
    },
  ] as Array<WLButton>,
});

const getJoinGroupForm = computed<WLForm>(() => joinGroupForm);
// #endregion

// #region Join existing group logic
const {
  addUserToGroup,
  getGroupById,
  isUserInGroup,
}: {
  addUserToGroup: Function;
  getGroupById: Function;
  isUserInGroup: Function;
} = useGroupsStore();

/**
 * Adds the user to the specified group
 *
 * @param { string } id Group's id
 * @param { Function } resetForm Function to reset the form
 *
 * Returns true or false depending if the operation it was successful or not
 */
async function joinExistingGroup(
  { id }: { id: string },
  { resetForm }: { resetForm: Function }
): Promise<boolean> {
  let success = false;

  // first check if group exists
  const groupExists = await getGroupById(id);

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  // if it does, try to add the user to it
  if (groupExists && loggedUser.value && loggedUser.value.uid) {
    const alreadyMember = await isUserInGroup(loggedUser.value.uid, id);

    if (alreadyMember === false) {
      const dataSet: Object = {
        status: WLGroupMembershipStatus.REQUESTED,
        userId: loggedUser.value.uid,
        groupId: id,
        admin: false,
        joinedOn: getISOFormattedCurrentDateTime(),
      };
      success = addUserToGroup(dataSet);

      resetForm();
    }
  }

  return success;
}
// #endregion
</script>
