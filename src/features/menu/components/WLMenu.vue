<template>
  <article class="wl-menu">
    <WLTabSelector
      v-bind="props.menuItems"
      class="wl-tabs-mainmenu"
    ></WLTabSelector>
  </article>
</template>

<script setup lang="ts">
import type { TabCollection } from "@/features/menu/types";

import WLTabSelector from "@/features/menu/components/WLTabSelector.vue";

const props = defineProps<{
  menuItems: TabCollection;
}>();
</script>

<style lang="scss">
@use "@/features/menu/assets/styles/wl-menu.scss";
</style>
