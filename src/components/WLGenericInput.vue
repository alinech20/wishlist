<template>
  <article class="wl-input-wrapper">
    <WLInputLabel
      :label-text="props.labelText"
      :name="props.name"
    ></WLInputLabel>
    <WLTextInput v-bind="props"></WLTextInput>
  </article>
</template>

<script setup lang="ts">
import WLInputLabel from "@/components/ui/WLInputLabel.vue";
import WLTextInput from "@/components/ui/WLTextInput.vue";

const props = defineProps<{
  labelText?: string;
  name: string;
  fieldElement?: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  autocomplete?: string;
  hidden?: string;
  value?: string;
}>();
</script>
