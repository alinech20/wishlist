<template>
  <article class="wl-menu">
    <WLTabSelector
      v-bind="props.menuItems"
      class="wl-tabs-mainmenu"
    ></WLTabSelector>
  </article>
</template>

<script setup lang="ts">
import type { TabCollection } from "@/types/tabs.types";

import WLTabSelector from "./WLTabSelector.vue";

const props = defineProps<{
  menuItems: TabCollection;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-menu.scss";
</style>
