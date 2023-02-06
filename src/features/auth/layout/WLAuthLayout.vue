<template>
  <div class="auth-layout-wrapper">
    <!-- content slot -->
    <main class="auth-section">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@use "@/features/auth/assets/styles/wl-auth-layout.scss";
</style>
