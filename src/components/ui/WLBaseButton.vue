<template>
  <article class="wl-button-wrapper">
    <button
      :class="['wl-button', props.xClasses]"
      :name="props.name"
      :type="props.type"
      :form="props.form"
      :disabled="props.disabled"
      @click="handleClick($event, props.buttonClick, props.clickParams)"
    >
      {{ props.text }}
    </button>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  type?: "button" | "reset" | "submit" | undefined;
  text: string;
  form?: string;
  xClasses?: string;
  buttonClick?: Function;
  clickParams?: Array<any>;
  disabled?: boolean;
}>();

// #region Click handle logic
/**
 *
 * @param {MouseEvent} e The event object we get from Vue
 * @param {Function | undefined} toCall Callback function for the click event
 */
const handleClick = (
  e: MouseEvent,
  toCall: Function | undefined,
  params: Array<any> | undefined
) => {
  const args: Array<any> = params || [];
  toCall && toCall(...args);
};
// #endregion
</script>

<style lang="scss">
@use "@/assets/styles/components/ui/wl-base-button.scss";
</style>
