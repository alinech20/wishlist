import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

import type { TabCollection, Tab } from "@/features/menu/types";
import { useRouter } from "vue-router";

export const useMenuStore = defineStore("menu", () => {
  const router = useRouter();

  // #region Active route logic (state & setter)
  const activeRoute = ref<string>(router.currentRoute.value.name as string);
  const setActiveRoute: Function = (v: string): string =>
    (activeRoute.value = v);
  // #endregion

  // #region Menu display logic (state & toggler)
  const showMenu = ref<boolean>(false);
  const toggleMenu: Function = (): boolean =>
    (showMenu.value = !showMenu.value);
  // #endregion

  // #region Menu items and navigation logic
  /**
   * Navigates to the path
   *
   * @param { string } path The new path
   * @param { string } name Name of the route
   */
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
      {
        name: "Wishlists",
        location: "/wishlist",
        active: computed<boolean>(() => activeRoute.value === "Wishlist"),
        onClick: () => navigateTo("/wishlists", "Wishlists"),
      },
    ] as Array<Tab>,
  });
  // #endregion

  return {
    mainMenuItems,
    setActiveRoute,
    showMenu,
    toggleMenu,
    activeRoute,
  };
});
