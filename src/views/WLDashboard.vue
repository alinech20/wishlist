<template>
  <WLBaseLayout>
    <WLActionCardList :action-cards="dashboardActions"></WLActionCardList>
  </WLBaseLayout>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import { useRouter, type Router } from "vue-router";

import WLBaseLayout from "@/layouts/WLBaseLayout.vue";
import WLActionCardList from "@/components/WLActionCardList.vue";

import type { ActionCard } from "@/types/action-cards.types";

import { CreateGroupIcon, WishlistIcon } from "@/components/ui/icons";

const router: Router = useRouter();

// action cards on the home page
const dashboardActions: Array<ActionCard> = [
  {
    icon: markRaw(CreateGroupIcon),
    name: "My Groups",
    action: () => router.push({ path: "/groups" }),
  },
  {
    icon: markRaw(WishlistIcon),
    name: "My Wishlists",
    action: () => router.push({ path: "/wishlists" }),
  },
];
</script>
