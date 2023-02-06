<template>
  <VeeForm
    :id="props.id"
    class="wl-form"
    :validation-schema="props.validationSchema"
    @submit="(values: Object, actions: Object) => $emit('submit-form', values, actions)"
  >
    <section class="wl-form__title">
      <slot name="title">
        <h3 class="heading heading--l form-title">{{ props.title }}</h3>
        <p v-if="props.additionalInfo" class="paragraph paragraph--s form-info">
          Note: {{ props.additionalInfo }}
        </p>
      </slot>
    </section>
    <section
      class="wl-form__message"
      v-if="
        showFormProcessingMessage && formProcessingMessage.type !== undefined
      "
    >
      <article
        :class="[`form-message form-message--${formProcessingMessage.type}`]"
      >
        {{ formProcessingMessage.message }}
      </article>
    </section>
    <section class="wl-form__fields">
      <slot name="fields">
        <!-- fallback content here -->
        <WLDropdown
          v-for="field in getDropdownFields"
          v-bind="field"
          :key="field.key"
        ></WLDropdown>
        <WLGenericInput
          v-for="(field, i) in getInputFields"
          v-bind="field"
          @update:value="(val: string) => $emit('update-input', i, val)"
          :key="field.key"
        ></WLGenericInput>
      </slot>
    </section>
    <section class="wl-form__buttons">
      <slot name="buttons">
        <!-- fallback content here -->
        <WLBaseButton
          v-for="button in props.buttons"
          v-bind="button"
          :key="button.key"
        ></WLBaseButton>
      </slot>
    </section>
  </VeeForm>
</template>

<script setup lang="ts">
import type {
  WLButton,
  WLField,
  WLFormSubmissionMessage,
} from "@/types/forms.types";
import { useFormStore } from "@/stores/form";
import { customComponentsValidation } from "@/helpers/validators";

import WLGenericInput from "@/components/WLGenericInput.vue";
import WLDropdown from "./ui/WLDropdown.vue";
import WLBaseButton from "@/components/ui/WLBaseButton.vue";

import { storeToRefs } from "pinia";
import { computed, type Ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  additionalInfo: {
    type: String,
    required: false,
    default: "",
  },
  validationSchema: {
    type: Object,
    required: true,
  },
  fields: {
    type: Array<WLField>,
    required: true,
    validator(value: Array<WLField>) {
      const requiredAttributes = ["name", "placeholder"];

      return customComponentsValidation(value, requiredAttributes);
    },
  },
  buttons: {
    type: Array<WLButton>,
    required: true,
    validator(value: Array<WLButton>) {
      const requiredAttributes = ["name", "text"];

      return customComponentsValidation(value, requiredAttributes);
    },
  },
});

const getInputFields = computed<Array<WLField>>(() =>
  props.fields.filter((f) => !f.fieldElement || f.fieldElement !== "select")
);

const getDropdownFields = computed<Array<WLField>>(() =>
  props.fields.filter((f) => f.fieldElement === "select")
);

const {
  showFormProcessingMessage,
  formProcessingMessage,
}: {
  showFormProcessingMessage: Ref<boolean>;
  formProcessingMessage: Ref<WLFormSubmissionMessage>;
} = storeToRefs(useFormStore());
</script>

<style lang="scss">
@use "@/assets/styles/components/wl-generic-form.scss";
</style>
