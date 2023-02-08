<template>
  <article class="auth-form--switcher">
    <p class="paragraph paragraph--s switch-to--register">
      {{ getQuestionText }}
      <strong
        ><a class="wl-link" @click="switchTab(switchTo as AuthTab)">{{
          getLinkText
        }}</a></strong
      >
    </p>
  </article>
</template>

<script setup lang="ts">
import { AuthTab } from "@/features/auth/types";
import { computed } from "vue";

const props = defineProps<{
  activeTab: string;
  switchTo: string;
  switchTab: Function;
}>();

// #region Getters for the question text and link
const getQuestionText = computed<string>((): string =>
  props.activeTab === AuthTab.LOGIN.toLowerCase()
    ? "Don't have an account?"
    : "Already registered?"
);

const getLinkText = computed<string>((): string =>
  props.activeTab === AuthTab.LOGIN.toLowerCase() ? "Sign up!" : "Sign in!"
);
// #endregion
</script>
