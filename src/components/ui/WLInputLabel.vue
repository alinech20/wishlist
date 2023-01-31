<template>
  <label
    class="paragraph paragraph--s wl-input-label"
    v-if="props.name && props.labelText"
    :for="props.name"
    >{{ props.labelText }}</label
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  labelText?: string;
  name: string;
}>();
</script>

<style lang="scss">
@use "@/assets/styles/components/ui/wl-input-label.scss";
</style>
