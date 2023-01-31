<template>
  <article class="wl-group-card">
    <section class="group-card__name">
      <h2 class="heading heading--m">{{ props.group.name }}</h2>
    </section>
    <section class="group-card__info">
      <p class="paragraph paragraph-m">
        Group budget is
        {{ props.group.budget ? props.group.budget : "not set" }}
      </p>
    </section>
    <section class="group-card__footer">
      <p class="paragraph paragraph--s">Member since {{ props.joinedOn }}</p>
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
