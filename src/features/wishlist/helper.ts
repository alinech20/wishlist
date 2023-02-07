import { storeToRefs } from "pinia";
import type { Ref } from "vue";

import { useWishlistStore } from "@/features/wishlist/store";
import { useAuthStore } from "@/features/auth/store";
import type { WLWishlist } from "@/features/wishlist/types";
import type { WLUser } from "@/features/auth/types";

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
    if (wishlistsInitialized.value) return wishlists.value;
    else {
      const userWishlists: Array<WLWishlist> = await fetchUserWishlists(
        loggedUser.value.uid
      );

      return userWishlists;
    }
  }
};
