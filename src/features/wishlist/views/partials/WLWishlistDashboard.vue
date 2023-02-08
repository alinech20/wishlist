<template>
  <WLActionCardList :action-cards="wishlistActions"></WLActionCardList>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import { useRouter } from "vue-router";

import type { ActionCard } from "@/types/action-cards.types";
import WLActionCardList from "@/components/WLActionCardList.vue";

import {
  CreateWishlistIcon,
  ShareWishlistIcon,
  ManageIcon,
} from "@/components/ui/icons";

const router = useRouter();

// #region Buttons to show on the wishlist dashboard
const wishlistActions: Array<ActionCard> = [
  {
    icon: markRaw(CreateWishlistIcon),
    name: "New wishlist",
    action: () => router.push({ name: "Create Wishlist" }),
  },
  {
    icon: markRaw(ShareWishlistIcon),
    name: "Share wishlist",
    action: () => router.push({ name: "Share Wishlist" }),
  },
  {
    icon: markRaw(ManageIcon),
    name: "Manage wishlists",
    action: () => router.push({ name: "Manage Wishlists" }),
  },
];
// #endregion
</script>
