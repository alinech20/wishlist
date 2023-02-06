<template>
  <div class="header-content-wrapper">
    <article class="header-section">
      <!-- menu + title + logout -->
      <section class="header__menu-wrapper">
        <MenuIcon @click="toggleMenu" />
        <WLMenu :menu-items="mainMenuItems" v-show="showMenu"></WLMenu>
      </section>
      <section class="header__title-wrapper">
        <h1 class="heading heading--m title-wrapper__title-text">
          {{ props.siteTitle }}
        </h1>
      </section>
      <section class="header__auth-wrapper">
        <AccountIcon />
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { MenuIcon, AccountIcon } from "@/components/ui/icons";
import WLMenu from "@/features/menu/components/WLMenu.vue";

import { useMenuStore } from "@/features/menu/store";
import type { TabCollection } from "@/features/menu/types";

import { storeToRefs } from "pinia";
import type { Ref } from "vue";

const props = defineProps({
  siteTitle: {
    type: String,
    required: true,
  },
  siteLogo: {
    type: String,
    required: true,
  },
  siteVersion: {
    type: String,
    required: true,
  },
});

const {
  mainMenuItems,
  showMenu,
}: {
  mainMenuItems: Ref<TabCollection>;
  showMenu: Ref<boolean>;
} = storeToRefs(useMenuStore());

const {
  toggleMenu,
}: {
  toggleMenu: Function;
} = useMenuStore();
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-header.scss";
</style>
