import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";

import type { WLItem } from "@/types/wishlist.types";
import type { WLForm, WLField, WLButton } from "@/types/forms.types";

export const useWishlistStore = defineStore("wishlist", () => {
  // #region Form toggler
  /**
   * Boolean for showing the form and toggler for the value
   */
  const showForm = ref<boolean>(false);
  const toggleForm: Function = (): boolean =>
    (showForm.value = !showForm.value);
  // #endregion

  // #region Wishlist form
  /**
   * wishlistForm contains the info and elements of the form
   * To change the validation schema, also check the helpers/validators.ts
   * To change the fields/buttons, just alter the arrays containing them
   */
  const wishlistForm = reactive<WLForm>({
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
      {
        key: "close-form-button",
        name: "close-form",
        type: "button",
        text: "Close form",
        form: "AddToWishlist",
        xClasses: "wl-button--primary-dark",
        buttonClick: toggleForm,
      } as WLButton,
    ] as Array<WLButton>,
  });
  // #endregion

  /** Item list logic start */
  const itemList = reactive<Array<WLItem>>([]);

  // #region Item list getters
  const getItemById = computed<(i: number) => WLItem | undefined>(
    () =>
      (id: number): WLItem | undefined =>
        itemList.find((i: WLItem) => i.id === id)
  );

  /**
   * Gets the item by its 0-based array index
   *
   * @param {number} i The item's index
   */
  const getItemByIndex = computed<(i: number) => WLItem | null>(
    () =>
      (i: number): WLItem | null =>
        itemList.length > i ? itemList[i] : null
  );

  /**
   * Gets the item's 0-based index from its id
   *
   * @param {number} id The item's id
   */
  const getItemIndexById = computed<(id: number) => number>(
    () =>
      (id: number): number =>
        itemList.findIndex((i) => i.id === id)
  );
  // #endregion

  // #region Item list actions
  /**
   * Adds an item to the list
   *
   * @param {WLItem} i Item to add to the list and db (has no id)
   *
   * Returns the item with the id from the db
   */
  const addItemToList: Function = (i: WLItem): WLItem => {
    // TODO: add to db so we get an id for the item
    itemList.push(i);
    return i;
  };

  /**
   * Deletes an item from the list
   *
   * @param {number} id Id of the item to delete from the list and db
   *
   * returns the deleted item
   */
  const deleteItemById: Function = (id: number): Array<WLItem> | null => {
    // TODO: delete from db
    const index: number = getItemIndexById.value(id);
    return index === -1 ? null : itemList.splice(index, 1);
  };
  // #endregion

  /** Item list logic end */

  return {
    showForm,
    toggleForm,
    wishlistForm,
    itemList,
    getItemById,
    getItemByIndex,
    addItemToList,
    deleteItemById,
  };
});
