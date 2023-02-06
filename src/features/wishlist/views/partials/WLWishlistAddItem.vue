<template>
  <WLGenericForm
    class="wl-form--fields-flex-column"
    v-bind="wishlistForm"
    @submitForm="addToWishlist"
  ></WLGenericForm>
</template>

<script setup lang="ts">
import { useWishlistStore } from "@/features/wishlist/store";

import WLGenericForm from "@/components/WLGenericForm.vue";

import type { WLButton, WLField, WLForm } from "@/types/forms.types";
import type { WLItem } from "@/features/wishlist/types";
import { useRoute } from "vue-router";

// #region Route params
const wishlistId = useRoute().params.id;
// #endregion

// #region Wishlist form
/**
 * wishlistForm contains the info and elements of the form
 * To change the validation schema, also check the helpers/validators.ts
 * To change the fields/buttons, just alter the arrays containing them
 */
const wishlistForm: WLForm = {
  id: "AddToWishlist",
  title: "Add to wishlist",
  validationSchema: {
    name: "required|alpha_spaces|min:3|max:60",
    url: {
      required: true,
      regexUrl:
        /https?:\/\/(www\.|[a-zA-Z0-9_-]*\.)?([a-zA-Z0-9_-]*\.)+[a-zA-z0-9.]{2,6}(\/[a-zA-Z0-9-_]*)*/,
    },
    comment: "",
  },
  fields: [
    {
      key: "name",
      labelText: "Name",
      type: "text",
      name: "name",
      required: true,
      placeholder: "Name...",
    } as WLField,
    {
      key: "url",
      labelText: "Link to item",
      type: "text",
      name: "url",
      placeholder: "URL...",
    } as WLField,
    {
      key: "comment",
      labelText: "Comment",
      name: "comment",
      fieldElement: "textarea",
      placeholder: "Your comment here...",
    } as WLField,
  ] as Array<WLField>,
  buttons: [
    {
      key: "add-item-button",
      form: "AddToWishlist",
      name: "add-item",
      type: "submit",
      text: "Add to wishlist!",
      xClasses: "wl-button--primary",
    } as WLButton,
    {
      key: "reset-form-button",
      name: "reset-form",
      type: "reset",
      text: "Reset form",
      form: "AddToWishlist",
      xClasses: "wl-button--secondary",
    } as WLButton,
  ] as Array<WLButton>,
};
// #endregion

// #region Logic for adding an item to the wishlist
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

  const { addItemToWishlist }: { addItemToWishlist: Function } =
    useWishlistStore();

  return addItemToWishlist(newItem, wishlistId);
}
// #endregion
</script>

<style lang="scss">
@use "@/assets/styles/views/wl-wishlist.scss";
</style>
