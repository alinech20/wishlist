<template>
  <article class="wl-action-cards-wrapper">
    <WLActionCard
      v-for="card in props.actionCards"
      :key="card.name"
      v-bind="card"
    ></WLActionCard>
  </article>
</template>

<script setup lang="ts">
import type { ActionCard } from "@/types/action-cards.types";
import WLActionCard from "./ui/WLActionCard.vue";

const props = defineProps<{
  actionCards: Array<ActionCard>;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-action-card-list.scss";
</style>
