<template>
  <article class="wl-itemlist-wrapper">
    <h2 class="heading heading--xl wl-itemlist__title">Your Wishlist</h2>
    <section v-if="itemList.length > 0" class="wl-items-wrapper">
      <!-- TODO: change key to item.id -->
      <WLListItem
        v-for="(item, i) in itemList"
        :key="i"
        v-bind="item"
      ></WLListItem>
    </section>
    <p v-else class="paragraph paragraph--s wl-itemlist__empty-list">
      Uh oh! You have no items in the list :(
    </p>
  </article>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { useWishlistStore } from "@/stores/wishlist";
import { storeToRefs } from "pinia";

import WLListItem from "@/components/ui/WLListItem.vue";

import type { WLItem } from "@/types/wishlist.types";

// #region Fetch items logic
const { itemList }: { itemList: Ref<Array<WLItem>> } = storeToRefs(
  useWishlistStore()
);
// #endregion
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-item-list.scss";
</style>
