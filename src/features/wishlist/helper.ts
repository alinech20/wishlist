import { storeToRefs } from "pinia";
import type { Ref } from "vue";

import { useWishlistStore } from "@/features/wishlist/store";
import { useAuthStore } from "@/features/auth/store";
import type { WLWishlist } from "@/features/wishlist/types";
import type { WLUser } from "@/features/auth/types";

// #region Initializer for the state's wishlist
/**
 * Gets the available wishlists of the logged user
 *
 * @returns { Array<WLWishlist> } Array with the wishlists
 */
export const initializeStateWishlists: Function = async (): Promise<
  Array<WLWishlist> | undefined
> => {
  const wishlistStore = useWishlistStore();

  const {
    wishlists,
    wishlistsInitialized,
  }: {
    wishlists: Ref<Array<WLWishlist>>;
    wishlistsInitialized: Ref<boolean>;
  } = storeToRefs(wishlistStore);

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  const {
    fetchUserWishlists,
  }: {
    fetchUserWishlists: Function;
  } = wishlistStore;

  if (loggedUser.value && loggedUser.value.uid) {
    // if state is already initialized, return from state
    if (wishlistsInitialized.value) return wishlists.value;
    else {
      // else fetch from db
      const userWishlists: Array<WLWishlist> = await fetchUserWishlists(
        loggedUser.value.uid
      );

      return userWishlists;
    }
  }
};
// #endregion
