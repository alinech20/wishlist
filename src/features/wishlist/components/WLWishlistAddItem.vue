<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-if="showForm"
    v-bind="wishlistForm"
    @submitForm="addToWishlist"
  ></WLGenericForm>
  <WLBaseButton
    v-else
    :name="'show-form-button'"
    :type="'button'"
    :text="'Add new item'"
    :form="'AddItemForm'"
    :xClasses="'wl-button--primary'"
    :buttonClick="toggleForm"
  ></WLBaseButton>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { storeToRefs } from "pinia";

import WLGenericForm from "@/components/WLGenericForm.vue";
import WLBaseButton from "@/components/ui/WLBaseButton.vue";

import type { WLItem } from "@/features/wishlist/types";
import type { WLForm } from "@/types/forms.types";

import { useWishlistStore } from "@/features/wishlist/store";

const wishlistStore = useWishlistStore();
const { toggleForm }: { toggleForm: Function } = wishlistStore;
const {
  wishlistForm,
  showForm,
}: { wishlistForm: Ref<WLForm>; showForm: Ref<boolean> } =
  storeToRefs(wishlistStore);

// #region Logic for adding an item to the wishlist
const { addItemToList }: { addItemToList: Function } = wishlistStore;

/**
 * Adds an item to the wishlist
 *
 * @param {WLItem} values Item to add to list
 * @param {Function} resetForm Function to reset form
 *      (destructured from VeeValidate param on submit)
 *
 * Returns the added item
 */
function addToWishlist(
  values: WLItem,
  { resetForm }: { resetForm: Function }
): WLItem {
  const newItem: WLItem = { ...values } as WLItem;
  resetForm();
  return addItemToList(newItem);
}
// #endregion
</script>

<style lang="scss">
@use "@/assets/styles/views/wl-wishlist.scss";
</style>
