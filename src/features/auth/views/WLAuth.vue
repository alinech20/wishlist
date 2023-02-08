<template>
  <WLAuthLayout>
    <WLGenericForm
      class="wl-form--fields-flex-column"
      v-bind="activeForm"
      @submitForm="handleEmailAuth"
    ></WLGenericForm>
    <WLAuthSwitcher
      :active-tab="activeTab"
      :switch-to="activeTab === 'login' ? 'register' : 'login'"
      :switch-tab="switchTab"
    ></WLAuthSwitcher>
  </WLAuthLayout>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import { useRouter } from "vue-router";

import WLAuthLayout from "@/features/auth/layout/WLAuthLayout.vue";
import WLGenericForm from "@/components/WLGenericForm.vue";
import WLAuthSwitcher from "@/features/auth/components/WLAuthSwitcher.vue";

import { AuthTab, type ExtendedEmailUserAuth } from "@/features/auth/types";
import type { WLForm } from "@/types/forms.types";

import { useAuthStore } from "@/features/auth/store";

// #region Form tabs logic
const activeTab = ref<string>(AuthTab.LOGIN.toLowerCase());
const switchTab: Function = (to: AuthTab): string => {
  activeTab.value = to.toLowerCase();
  // tabSet.tabs.forEach((i) => (i.active = activeTab.value === i.location));
  return activeTab.value;
};
// #endregion

// getting the functions we need from the store
const {
  getForm,
  handleEmailRegister,
  handleEmailLogin,
}: {
  getForm: Function;
  handleEmailRegister: Function;
  handleEmailLogin: Function;
} = useAuthStore();

// #region Render the correct form
const activeForm: ComputedRef<WLForm> = computed(
  (): WLForm => getForm(activeTab.value)
);
// #endregion

// #region Handling the form submission
// initializing the router to be able to redirect after register/login
const router = useRouter();

/**
 * Handles the auth step based on the active view (register/login)
 *
 * @param { Object } values Has the values for the auth
 * @param { Function } resetForm Function from VeeValidate to reset the form
 */
function handleEmailAuth(
  values: Object,
  { resetForm }: { resetForm: Function }
): void {
  const user: ExtendedEmailUserAuth = { ...values } as ExtendedEmailUserAuth;
  const onAuthSucces: Function = (): void => {
    resetForm();
    router.push({ name: "Dashboard" });
  };

  switch (activeTab.value) {
    case AuthTab.REGISTER.toLowerCase():
      handleEmailRegister(user, onAuthSucces);
      break;
    case AuthTab.LOGIN.toLowerCase():
      handleEmailLogin(user, onAuthSucces);
      break;
  }
}
// #endregion
</script>

<style lang="scss">
@use "@/features/auth/assets/styles/wl-auth.scss";
</style>
