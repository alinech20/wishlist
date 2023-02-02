<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="getCreateGroupForm"
    @submitForm="createNewGroup"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { computed, reactive, type Ref } from "vue";
import { getISOFormattedCurrentDateTime } from "@/helpers/date";

import { WLGroupMembershipStatus, type WLGroup } from "@/types/wishlist.types";
import type { WLButton, WLField, WLForm } from "@/types/forms.types";
import type { WLUser } from "@/types/auth.types";

import { useGroupsStore } from "@/stores/groups";
import { useAuthStore } from "@/stores/auth";

import WLGenericForm from "../../WLGenericForm.vue";
import { storeToRefs } from "pinia";

// #region Add or remove friend email fields
/**
 * Adds a new friend email field by using a closure to keep count of the fields
 */
const addFriendInput: Function = () => {
  let existingFriendInputs = 0;

  return function () {
    const friendField = {
      key: `add-friend-${++existingFriendInputs}`,
      type: "email",
      name: `add-friend-${existingFriendInputs}`,
      required: true,
      placeholder: "Friend's email...",
    };

    createGroupForm.fields.push(friendField);
  };
};

/**
 * Removes a friend email field
 */
const removeFriendInput: Function = () => {
  const noOfFields = createGroupForm.fields.length;
  if (createGroupForm.fields[noOfFields - 1].name.includes("add-friend"))
    createGroupForm.fields.pop();
};
// #endregion

// #region Create group form data and getter
const createGroupForm = reactive<WLForm>({
  id: "CreateGroup",
  title: "Create a group",
  validationSchema: {
    name: "required|alpha_spaces|min:3|max:24",
    event: "alpha_spaces|max:24",
    date: {
      regexDate: /^((1[3-9]|20)\d{2})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/,
    },
    number: "numeric",
    "add-friend": "email|min:5|max:60",
  },
  fields: [
    {
      key: "name",
      type: "text",
      name: "name",
      required: true,
      placeholder: "Name...",
    } as WLField,
    {
      key: "event",
      type: "text",
      name: "event",
      placeholder: "Event...",
    } as WLField,
    {
      key: "deadline",
      type: "date",
      name: "date",
      placeholder: "Date...",
    } as WLField,
    {
      key: "budget",
      type: "number",
      name: "budget",
      placeholder: "Budget...",
    } as WLField,
  ] as Array<WLField>,
  buttons: [
    {
      key: "create-group-button",
      form: "CreateGroup",
      name: "create-group",
      type: "submit",
      text: "Create group",
      xClasses: "wl-button--primary",
    } as WLButton,
    {
      key: "add-friend-button",
      form: "CreateGroup",
      name: "add-friend",
      type: "button",
      text: "Add friend",
      xClasses: "wl-button--primary-dark",
      buttonClick: addFriendInput(),
    } as WLButton,
    {
      key: "remove-friend-button",
      form: "CreateGroup",
      name: "remove-friend",
      type: "button",
      text: "Remove friend field",
      xClasses: "wl-button--secondary-dark",
      buttonClick: removeFriendInput,
    } as WLButton,
    {
      key: "reset-form-button",
      form: "CreateGroup",
      name: "reset-form",
      type: "reset",
      text: "Reset form",
      xClasses: "wl-button--secondary",
    } as WLButton,
  ] as Array<WLButton>,
});

const getCreateGroupForm = computed<WLForm>(() => createGroupForm);
// #endregion

// #region Create new group logic
const {
  createGroup,
  addUserToGroup,
}: { createGroup: Function; addUserToGroup: Function } = useGroupsStore();

/**
 * Creates a new group and automatically adds the user that created it
 * to the group, setting them as the admin
 *
 * @param { WLGroup } values Group data to be saved to db
 * @param { Function } resetForm Function to reset the form
 */
async function createNewGroup(
  values: WLGroup,
  { resetForm }: { resetForm: Function }
): Promise<void> {
  const newGroup: WLGroup = { ...values };
  resetForm();

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  if (loggedUser.value && loggedUser.value.uid) {
    newGroup.createdBy = loggedUser.value.uid;
  }

  newGroup.createdOn = getISOFormattedCurrentDateTime();
  newGroup.modifiedOn = newGroup.createdOn;

  // try to create the group
  const groupId = await createGroup(newGroup);

  // add user to group as admin if group was created
  if (groupId) {
    addUserToGroup({
      status: WLGroupMembershipStatus.ACCEPTED,
      userId: newGroup.createdBy,
      groupId: groupId,
      admin: true,
      joinedOn: newGroup.createdOn,
    });
  }
}
// #endregion
</script>
