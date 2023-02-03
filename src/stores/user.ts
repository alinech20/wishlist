import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, type Ref } from "vue";

import type { WLUser } from "@/types/auth.types";
import type {
  WLGroupMembershipStatus,
  WLUserGroup,
} from "@/types/wishlist.types";

import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", () => {
  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );
  const user = ref<WLUser>(loggedUser.value);

  // all user groups
  const groups = reactive<Array<WLUserGroup>>([]);

  /**
   * Setter for the groups
   *
   * @param { Array<WLUserGroup> } ug Array of groups
   * @returns { Array<WLUserGroup> } End result
   */
  const setGroups: Function = (ug: Array<WLUserGroup>): Array<WLUserGroup> => {
    for (const group of ug) {
      groups.push(group);
    }

    return groups;
  };

  /**
   * Updates user's relation with a group
   *
   * @param { string } gid Group's id
   * @param { WLGroupMembershipStatus } status New status
   * @returns { WLUserGroup } Affected group
   */
  const updateGroupStatus: Function = (
    gid: string,
    status: WLGroupMembershipStatus
  ): WLUserGroup => {
    const gIndex: number = groups.findIndex((g) => g.group.id === gid);
    groups[gIndex].status = status;
    return groups[gIndex];
  };

  /**
   * Adds a new group
   *
   * @param { WLUserGroup } g Group to be added
   * @returns { Array<WLUserGroup> } New groups array
   */
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
    updateGroupStatus,
    pushGroup,
    groupsInitialized,
    setGroupsInitialized,
    getUserData,
  };
});
