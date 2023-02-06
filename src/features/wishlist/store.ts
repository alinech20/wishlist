import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import type { WLItem, WLWishlist } from "@/features/wishlist/types";

import {
  addDoc,
  collection,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/helpers/firebase";
import { useFormStore } from "@/stores/form";

export const useWishlistStore = defineStore("wishlist", () => {
  // /** Item list logic start */
  // const itemList = reactive<Array<WLItem>>([]);

  // // #region Item list getters
  // const getItemById = computed<(i: string) => WLItem | undefined>(
  //   () =>
  //     (id: string): WLItem | undefined =>
  //       itemList.find((i: WLItem) => i.id === id)
  // );

  // /**
  //  * Gets the item by its 0-based array index
  //  *
  //  * @param {number} i The item's index
  //  */
  // const getItemByIndex = computed<(i: number) => WLItem | null>(
  //   () =>
  //     (i: number): WLItem | null =>
  //       itemList.length > i ? itemList[i] : null
  // );

  // /**
  //  * Gets the item's 0-based index from its id
  //  *
  //  * @param {number} id The item's id
  //  */
  // const getItemIndexById = computed<(id: string) => number>(
  //   () =>
  //     (id: string): number =>
  //       itemList.findIndex((i) => i.id === id)
  // );
  // // #endregion

  const wishlists = reactive<Array<WLWishlist>>([]);

  // #region Wishlist getters
  const getWishlistById = computed<(id: string) => WLWishlist | undefined>(
    () =>
      (id: string): WLWishlist | undefined =>
        wishlists.find((w) => w.id === id)
  );

  const getWishlistItems = computed<
    (w: WLWishlist) => Array<WLItem> | undefined
  >(
    () =>
      (w: WLWishlist): Array<WLItem> | undefined =>
        w.itemList
  );
  // #endregion

  // #region Importing some helpful stuff from the form store
  const formStore = useFormStore();

  const {
    setFormProcessingMessage,
    hideFormMessage,
    showFormMessage,
  }: {
    setFormProcessingMessage: Function;
    hideFormMessage: Function;
    showFormMessage: Function;
  } = formStore;
  // #endregion

  // #region Wishlist actions
  // /**
  //  * Deletes an item from the list
  //  *
  //  * @param {number} id Id of the item to delete from the list and db
  //  *
  //  * returns the deleted item
  //  */
  // const deleteItemById: Function = (id: string): Array<WLItem> | null => {
  //   // TODO: delete from db
  //   const index: number = getItemIndexById.value(id);
  //   return index === -1 ? null : itemList.splice(index, 1);
  // };
  // #endregion

  // #region Actions that work with the database, not just the app's state
  const createWishlist: Function = async (
    w: WLWishlist
  ): Promise<string | null> => {
    showFormMessage("Your wishlist is being created...");

    try {
      const newWishlist: DocumentReference<DocumentData> = await addDoc(
        collection(db, "wishlists"),
        w
      );

      setFormProcessingMessage({
        type: "success",
        message: "Wishlist successfully created!",
      });

      newWishlist && wishlists.push(w);

      hideFormMessage();
      return newWishlist.id;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
      return null;
    }
  };

  /**
   * Adds an item to a wishlist
   *
   * @param { WLItem } i Item to add to the list and db (has no id)
   * @param { string } wid Wishlist id
   *
   * Returns the item with the id from the db
   */
  const addItemToWishlist: Function = async (
    i: WLItem,
    wid: string
  ): Promise<WLItem | undefined> => {
    showFormMessage("Adding item to wishlist...");
    // TODO: check the if it gets added to store
    try {
      const newItem: DocumentReference<DocumentData> = await addDoc(
        collection(db, "wishlists", wid, "wishlist_items"),
        i
      );

      setFormProcessingMessage({
        type: "success",
        message: "Successfully added the item!",
      });

      i.id = newItem.id;
      getWishlistById.value(wid)?.itemList?.push(i);

      return i;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
    }
  };
  // #endregion

  /** Item list logic end */

  return {
    createWishlist,
    addItemToWishlist,
  };
});
