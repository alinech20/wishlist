<template>
  <article class="wl-item">
    <section class="wl-item__title-wrapper" @click="toggleInfo($event)">
      <p class="paragraph paragraph--m wl-item-title__title">
        <strong>{{ props.name }}</strong>
      </p>
    </section>
    <hr class="wl-item__title-divider" v-show="showInfo" />
    <section class="wl-item__controls" v-show="showInfo">
      <WLBaseButton
        v-for="button in itemControls"
        v-bind="button"
        :key="button.key"
      ></WLBaseButton>
    </section>
    <section class="wl-item__info" v-show="showInfo">
      <article class="wl-item-info__comment-wrapper" v-if="props.comment">
        <p class="paragraph paragraph--s wl-item-info__comment-title">
          <strong>Note:</strong>
        </p>
        <blockquote
          class="paragraph paragraph--s quote wl-item-info__comment-text"
        >
          {{ props.comment }}
        </blockquote>
      </article>
    </section>
  </article>
</template>

<script setup lang="ts">
import WLBaseButton from "./WLBaseButton.vue";

import type { WLButton } from "@/types/forms.types";
import { reactive, ref } from "vue";

const props = defineProps<{
  id?: number;
  name: string;
  url: string;
  comment: string;
}>();

const showInfo = ref<boolean>(false);
const toggleInfo: Function = (): boolean => (showInfo.value = !showInfo.value);

const seeItemPage: Function = (): void => {};
const assignToSelfToggle: Function = (): void => {};
const checkToggle: Function = (): void => {};

const itemControls: Array<WLButton> = reactive([
  {
    key: "url",
    name: "link-to-item",
    text: "Link",
    xClasses: "wl-button--secondary-dark",
    buttonClick: seeItemPage,
  },
  {
    key: "reserve",
    name: "reserve-toggle",
    text: "Lock",
    xClasses: "wl-button--primary-dark",
    buttonClick: assignToSelfToggle,
  },
  {
    key: "check",
    name: "check-toggle",
    text: "Check",
    xClasses: "wl-button--primary",
    buttonClick: checkToggle,
  },
]);
</script>

<style lang="scss">
@use "@/assets/styles/components/ui/wl-list-item.scss";
</style>
