<template>
  <article class="wl-select-wrapper">
    <VeeField
      class="wl-select"
      :bails="false"
      :name="props.name"
      v-slot="{ errors }"
      as="select"
    >
      <option v-if="props.labelText" value="" selected disabled>
        {{ props.labelText }}
      </option>
      <option
        v-for="option in (props.options as Array<WLDropdownOption>)"
        :key="option.optionValue"
        :value="option.optionValue"
      >
        {{ option.displayName }}
      </option>
      <section
        v-if="errors.length > 0"
        class="wl-input-validation-errors-wrapper"
      >
        <div class="wl-input-validation-error" v-for="e in errors" :key="e">
          {{ e }}
        </div>
      </section>
    </VeeField>
  </article>
</template>

<script setup lang="ts">
import type { WLDropdownOption } from "@/types/forms.types";
import type { ComputedRef } from "vue";

const props = defineProps<{
  options?: Array<WLDropdownOption> | ComputedRef<Array<WLDropdownOption>>;
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
