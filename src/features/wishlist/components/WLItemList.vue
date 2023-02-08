<template>
  <article class="wl-item-list">
    <WLItemComponent
      v-for="item in props.items"
      :key="item.id"
      v-bind="item"
    ></WLItemComponent>
  </article>
</template>

<script setup lang="ts">
import type { WLItem } from "@/features/wishlist/types";

import WLItemComponent from "@/features/wishlist/components/WLItem.vue";

const props = defineProps<{
  items: Array<WLItem>;
}>();
</script>

<style lang="scss">
@use "@/features/wishlist/assets/styles/components/wl-item-list.scss";
</style>
