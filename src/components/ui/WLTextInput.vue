<template>
  <VeeField :bails="false" :name="props.name" v-slot="{ field, errors }">
    <textarea
      v-if="props.fieldElement === 'textarea'"
      class="wl-input wl-input--textarea"
      rows="5"
      v-bind="field"
      :name="props.name"
      :type="props.type"
      :required="props.required"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
    >
    </textarea>
    <input
      v-else-if="!props.hidden"
      class="wl-input"
      v-bind="field"
      :name="props.name"
      :type="props.type"
      :required="props.required"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
    />
    <input
      v-else
      class="wl-input"
      v-bind="field"
      :name="props.name"
      :type="props.type"
      :hidden="props.hidden"
      :value="props.value"
    />
    <section
      v-if="errors.length > 0"
      class="wl-input-validation-errors-wrapper"
    >
      <div class="wl-input-validation-error" v-for="e in errors" :key="e">
        {{ e }}
      </div>
    </section>
  </VeeField>
</template>

<script setup lang="ts">
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

<style lang="scss">
@use "@/assets/styles/components/ui/wl-text-input.scss";
</style>
