<template>
  <article class="wl-tabs">
    <WLBaseButton
      v-for="tab in props.tabs"
      :key="tab.location"
      :name="tab.location"
      :text="tab.name"
      :button-click="tab.onClick"
      :x-classes="'wl-tab'"
      :class="{ active: tab.active }"
    >
    </WLBaseButton>
  </article>
</template>

<script setup lang="ts">
// import WLTab from "./ui/WLTab.vue";
import WLBaseButton from "./ui/WLBaseButton.vue";

import { customComponentsValidation } from "@/helpers/validators";
import type { Tab } from "@/types/tabs.types";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array<Tab>,
    required: true,
    validator(value: Array<Tab>) {
      const requiredAttributes = ["name", "location", "active", "onClick"];

      return customComponentsValidation(value, requiredAttributes);
    },
  },
});
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-tab-selector.scss";
</style>
