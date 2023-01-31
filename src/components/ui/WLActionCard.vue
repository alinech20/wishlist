<template>
  <article class="wl-card wl-action-card" @click="props.action">
    <section class="action-card__icon">
      <component :is="props.icon"></component>
    </section>
    <section class="action-card__name">
      <p class="paragraph paragraph--m">{{ props.name }}</p>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { ActionCard } from "@/types/action-cards.types";
import type { Component } from "vue";

const props: ActionCard = defineProps<{
  icon: Component;
  name: string;
  action: Function;
  backgroundColor?: string;
  textColor?: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/components/ui/wl-action-card.scss";
</style>
