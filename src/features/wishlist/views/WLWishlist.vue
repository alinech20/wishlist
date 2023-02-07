<template>
  <WLBaseLayout>
    <RouterView></RouterView>
  </WLBaseLayout>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";

import WLBaseLayout from "@/layouts/WLBaseLayout.vue";
import { initializeStateWishlists } from "@/features/wishlist/helper";

onBeforeMount(async () => await initializeStateWishlists());
</script>
