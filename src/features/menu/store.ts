import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

import type { TabCollection, Tab } from "@/features/menu/types";
import { useRouter } from "vue-router";

export const useMenuStore = defineStore("menu", () => {
  const router = useRouter();

  const activeRoute = ref<string>(router.currentRoute.value.name as string);
  const setActiveRoute: Function = (v: string): string =>
    (activeRoute.value = v);

  const showMenu = ref<boolean>(false);
  const toggleMenu: Function = (): boolean =>
    (showMenu.value = !showMenu.value);

  const navigateTo: Function = (path: string, name: string): void => {
    setActiveRoute(name);
    toggleMenu();
    router.push({ path });
  };

  const mainMenuItems = reactive<TabCollection>({
    title: "MainMenu",
    tabs: [
      {
        name: "Dashboard",
        location: "/",
        active: computed<boolean>(() => activeRoute.value === "Dashboard"),
        onClick: () => navigateTo("/", "Dashboard"),
      } as Tab,
      {
        name: "Groups",
        location: "/groups",
        active: computed<boolean>(() => activeRoute.value === "Groups"),
        onClick: () => navigateTo("/groups", "Groups"),
      } as Tab,
    ] as Array<Tab>,
  });

  return {
    mainMenuItems,
    setActiveRoute,
    showMenu,
    toggleMenu,
    activeRoute,
  };
});
