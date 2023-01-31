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
@use "@/assets/styles/layouts/wl-auth-layout.scss";
</style>
