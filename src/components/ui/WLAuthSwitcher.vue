<template>
  <article class="auth-form--switcher">
    <p class="paragraph paragraph--s switch-to--register">
      {{ questionText }}
      <strong
        ><a class="wl-link" @click="switchTab(switchTo as AuthTab)">{{
          linkText
        }}</a></strong
      >
    </p>
  </article>
</template>

<script setup lang="ts">
import { AuthTab } from "@/types/auth.types";
import { type ComputedRef, computed } from "vue";

const props = defineProps<{
  activeTab: string;
  switchTo: string;
  switchTab: Function;
}>();

const questionText: ComputedRef<string> = computed((): string =>
  props.activeTab === AuthTab.LOGIN.toLowerCase()
    ? "Don't have an account?"
    : "Already registered?"
);

const linkText: ComputedRef<string> = computed((): string =>
  props.activeTab === AuthTab.LOGIN.toLowerCase() ? "Sign up!" : "Sign in!"
);
</script>
