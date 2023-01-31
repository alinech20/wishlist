<template>
  <article class="wl-card wl-group-card">
    <section class="group-card__name">
      <h2 class="heading heading--xs">{{ props.group.name }}</h2>
    </section>
    <section class="group-card__details">
      <section class="group-card__info">
        <p class="paragraph paragraph--s">
          Budget:
          <strong>{{
            props.group.budget ? props.group.budget : "not set"
          }}</strong>
        </p>
      </section>
      <section class="group-card__footer">
        <p class="paragraph paragraph--s">
          Deadline:
          <strong>{{ props.group.date }}</strong>
        </p>
      </section>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { WLUserGroup } from "@/types/wishlist.types";

const props: WLUserGroup = defineProps<{
  joinedOn: string;
  admin: boolean;
  group: {
    id?: string;
    name: string;
    event?: string;
    date?: string;
    budget?: number;
    createdBy: string;
    createdOn?: string;
    modifiedOn?: string;
  };
}>();
</script>

<style lang="scss">
@use "@/assets/styles/components/groups/wl-group-card.scss";
</style>
