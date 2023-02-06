<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="createWishlistForm"
    @submitForm="createNewWishlist"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { useRouter } from "vue-router";

import { getISOFormattedCurrentDateTime } from "@/helpers/date";

import WLGenericForm from "@/components/WLGenericForm.vue";
import { useAuthStore } from "@/features/auth/store";
import { useWishlistStore } from "@/features/wishlist/store";

import type { WLUser } from "@/features/auth/types";
import type { WLWishlist } from "@/features/wishlist/types";
import type { WLForm, WLButton, WLField } from "@/types/forms.types";

const createWishlistForm: WLForm = {
  id: "CreateWishlist",
  title: "Create a wishlist",
  additionalInfo: "This info will only be visible to you",
  validationSchema: {},
  fields: [
    {
      key: "name",
      name: "name",
      required: true,
      placeholder: "Name...",
    } as WLField,
    {
      key: "description",
      name: "description",
      placeholder: "Description...",
    } as WLField,
  ] as Array<WLField>,
  buttons: [
    {
      key: "create-wishlist-button",
      form: "CreateWishlist",
      name: "create-wishlist",
      type: "submit",
      text: "Create wishlist",
      xClasses: "wl-button--primary",
    } as WLButton,
    {
      key: "reset-form-button",
      form: "CreateWishlist",
      name: "reset-form",
      type: "reset",
      text: "Reset form",
      xClasses: "wl-button--secondary",
    } as WLButton,
  ] as Array<WLButton>,
};

const router = useRouter();

async function createNewWishlist(
  values: WLWishlist,
  { resetForm }: { resetForm: Function }
): Promise<void> {
  const newWishlist: WLWishlist = { ...values };
  resetForm();

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  if (loggedUser.value && loggedUser.value.uid) {
    newWishlist.uid = loggedUser.value.uid;
  }

  newWishlist.createdOn = getISOFormattedCurrentDateTime();
  newWishlist.modifiedOn = newWishlist.createdOn;

  const { createWishlist }: { createWishlist: Function } = useWishlistStore();
  const wishlistId: string = await createWishlist(newWishlist);

  router.push({
    name: "Add Item",
    params: {
      id: wishlistId,
    },
  });
}
</script>
