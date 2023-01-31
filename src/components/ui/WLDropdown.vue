<template>
  <select>
    <option
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.displayName }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { WLDropdownOption } from "@/types/forms.types";
// TODO: finalize dropdown and add in form
const props = defineProps<{
  options: Array<WLDropdownOption>;
}>();
</script>
