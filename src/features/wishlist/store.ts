import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";

import type { WLItem, WLWishlist } from "@/features/wishlist/types";

import {
  addDoc,
  collection,
  getDocs,
  query,
  QuerySnapshot,
  where,
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

  // #region Wishlist state and getters
  const wishlists = reactive<Array<WLWishlist>>([]);

  /**
   * Gets the wishlist by its id
   *
   * @param { string } id Wishlist id
   * @returns { WLWishlist } Wishlist
   */
  const getWishlistById: Function = (id: string): WLWishlist | undefined =>
    wishlists.find((w) => w.id === id);

  /**
   * Gets the items in a wishlist
   *
   * @param { WLWishlist } w Wishlist
   * @returns { Array<WLItem> } Array of items in the wishlist
   */
  const getWishlistItems = computed<
    (w: WLWishlist) => Array<WLItem> | undefined
  >(() => (w: WLWishlist): Array<WLItem> | undefined => {
    return w.itemList;
  });

  /**
   * Sorts the items in the wishlist by date.
   *
   * @param { Array<WLItem> } items Array to sort by date
   * @param { -1 | 0 | 1 } order Dictates the order (-1 is descending, 1 is ascending)
   * @returns { Array<WLItem> } A sorted copy of the array
   */
  const getWishlistItemsSortedByDate = computed<
    (items: Array<WLItem>, order: -1 | 0 | 1) => Array<WLItem>
  >(() => (items: Array<WLItem>, order: -1 | 0 | 1 = 1): Array<WLItem> => {
    const arr = [...items];

    return order === 0
      ? arr
      : arr.sort((a, b) => order * a.createdOn.localeCompare(b.createdOn));
  });

  const getWishlistItemById = computed<
    (w: WLWishlist, iid: string) => WLItem | undefined
  >(
    () =>
      (w: WLWishlist, iid: string): WLItem | undefined =>
        w.itemList && w.itemList.length > 0
          ? w.itemList?.find((i) => i.id === iid)
          : undefined
  );

  const getWishlistItemByIndex = computed<
    (w: WLWishlist, ii: number) => WLItem | undefined
  >(
    () =>
      (w: WLWishlist, ii: number): WLItem | undefined =>
        w.itemList && w.itemList.length > 0 ? w.itemList[ii] : undefined
  );

  const getWishlistItemIndexById = computed<
    (w: WLWishlist, iid: string) => number | undefined
  >(
    () =>
      (w: WLWishlist, iid: string): number | undefined =>
        w.itemList && w.itemList.length > 0
          ? w.itemList.findIndex((i) => i.id === iid)
          : undefined
  );
  // #endregion

  // #region Wishlists actions that only affect the state (no db actions)
  /**
   * Sets the state wishlists
   *
   * @param { Array<WLWishlist> } wl Array of wishlists
   * @returns { Array<WLWishlist> } Array of wishlists from state
   */
  const setWishlists: Function = (wl: Array<WLWishlist>): Array<WLWishlist> => {
    if (wishlists.length === 0 && wl.length > 0)
      for (const wishlist of wl) wishlists.push(wishlist);
    return wishlists;
  };
  // #endregion

  // #region Tracking if the wishlists have been initialized
  const wishlistsInitialized = ref<boolean>(false);
  const setWishlistsInitialized: Function = (v: boolean): boolean =>
    (wishlistsInitialized.value = v);
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
  /**
   * Adds a wishlist to state and db
   *
   * @param { WLWishlist } w Wishlist to add
   * @returns { string } Id of the newly created wishlist
   */
  const createWishlist: Function = async (
    w: WLWishlist
  ): Promise<string | undefined> => {
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

      hideFormMessage();

      newWishlist && wishlists.push(w);

      return newWishlist.id;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
    }
  };

  /**
   * Adds an item to a wishlist
   *
   * @param { WLItem } i Item to add to the list and db (has no id)
   * @param { string } wid Wishlist id
   * @returns { WLItem } The item with the id from the db
   */
  const addItemToWishlist: Function = async (
    i: WLItem,
    wid: string
  ): Promise<WLItem | undefined> => {
    showFormMessage("Adding item to wishlist...");
    try {
      const newItem: DocumentReference<DocumentData> = await addDoc(
        collection(db, "wishlists", wid, "wishlist_items"),
        i
      );

      setFormProcessingMessage({
        type: "success",
        message: "Successfully added the item!",
      });

      hideFormMessage();

      i.id = newItem.id;
      getWishlistById(wid).itemList?.push(i);

      return i;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
    }
  };

  /**
   * Gets the user's wishlists from the db
   *
   * @param { string } uid Id of the user
   * @returns { Array<WLWishlist> } User's wishlists
   */
  const fetchUserWishlists: Function = async (
    uid: string
  ): Promise<Array<WLWishlist> | undefined> => {
    try {
      const userWishlists: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(db, "wishlists"), where("uid", "==", uid))
      );

      await Promise.all(
        userWishlists.docs.map(async (d) => {
          const docData: DocumentData = d.data();

          const items: QuerySnapshot<DocumentData> = await getDocs(
            collection(db, "wishlists", d.id, "wishlist_items")
          );

          const wl: WLWishlist = {
            id: d.id,
            itemList: [] as Array<WLItem>,
            ...docData,
          } as WLWishlist;

          items.docs.forEach((document) => {
            wl.itemList?.push({
              id: document.id,
              ...document.data(),
            } as WLItem);
          });

          wishlists.push(wl);
        })
      );

      setWishlistsInitialized(true);

      return wishlists;
    } catch (e: any) {
      console.error(e);
    }
  };
  // #endregion

  /** Item list logic end */

  return {
    wishlists,
    createWishlist,
    getWishlistById,
    getWishlistItems,
    getWishlistItemsSortedByDate,
    addItemToWishlist,
    setWishlists,
    wishlistsInitialized,
    setWishlistsInitialized,
    fetchUserWishlists,
  };
});
