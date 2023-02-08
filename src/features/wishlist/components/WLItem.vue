<template>
  <article class="wl-item">
    <section class="wl-item__title" @click="toggleShowDetails">
      <h2 class="heading heading--xs">{{ props.name }}</h2>
    </section>
    <section class="wl-item__details" v-show="showDetails">
      <blockquote
        v-if="props.comment"
        class="wl-quote details__author-comment paragraph paragraph--s"
      >
        {{ props.comment }}
      </blockquote>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  id?: string;
  name: string;
  url?: string;
  comment?: string;
}>();

// #region Item details logic (state & toggler)
const showDetails = ref<boolean>(false);
const toggleShowDetails = (): void => {
  showDetails.value = !showDetails.value;
};
// #endregion
</script>

<style lang="scss">
@use "@/features/wishlist/assets/styles/components/wl-item.scss";
</style>
