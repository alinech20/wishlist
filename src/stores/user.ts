import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

import type { WLUser } from "@/types/auth.types";
import type { WLUserGroup } from "@/types/wishlist.types";

import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", () => {
  const { getLoggedUser }: { getLoggedUser: WLUser | false } = useAuthStore();
  const user = ref<WLUser | false>(getLoggedUser);

  const groups = reactive<Array<WLUserGroup>>([]);

  const setGroups: Function = (ug: Array<WLUserGroup>): Array<WLUserGroup> => {
    for (const group of ug) {
      groups.push(group);
    }

    return groups;
  };

  const pushGroup: Function = (g: WLUserGroup): Array<WLUserGroup> => {
    groups.push(g);
    return groups;
  };

  const groupsInitialized = ref<boolean>(false);
  const setGroupsInitialized: Function = (v: boolean): boolean =>
    (groupsInitialized.value = v);

  const userData = reactive({
    user,
    groups,
  });

  const getUserData = computed(() => userData);

  return {
    groups,
    setGroups,
    pushGroup,
    groupsInitialized,
    setGroupsInitialized,
    getUserData,
  };
});
