<template>
  <div class="base-layout-wrapper">
    <!-- header slot -->
    <header class="header">
      <slot name="header">
        <!-- fallback content here -->
        <WLHeader
          :site-title="appConfig.title"
          :site-logo="appConfig.logoUrl"
          :site-version="appConfig.version"
        ></WLHeader>
      </slot>
    </header>
    <!-- sidebar slot -->
    <aside class="sidebar">
      <slot name="sidebar">
        <!-- fallback content here -->
      </slot>
    </aside>
    <!-- content slot -->
    <main class="main-section">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import WLHeader from "@/components/WLHeader.vue";
import * as appConfig from "@/assets/config/app.config.json";
</script>

<style lang="scss">
@use "@/assets/styles/layouts/wl-base-layout.scss";
</style>
