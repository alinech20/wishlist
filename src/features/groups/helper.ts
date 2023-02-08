import { useAuthStore } from "@/features/auth/store";
import { useGroupsStore } from "@/features/groups/store";
import { useUserStore } from "@/stores/user";
import type { WLUser } from "@/features/auth/types";
import type {
  WLGroupMembershipStatus,
  WLUserGroup,
} from "@/features/groups/types";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";

/**
 * Initializes the groups in the store's state
 *
 * @param { WLGroupMembershipStatus } status (Optional) Status to filter by
 * @returns { Array<WLUserGroup> } Array with the groups
 */
export const initializeStateGroups: Function = async (
  status?: WLGroupMembershipStatus
): Promise<Array<WLUserGroup> | undefined> => {
  const userStore = useUserStore();

  const {
    groups,
    groupsInitialized,
  }: { groups: Ref<Array<WLUserGroup>>; groupsInitialized: Ref<boolean> } =
    storeToRefs(userStore);

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  const { fetchUserGroups }: { fetchUserGroups: Function } = useGroupsStore();

  const {
    setGroups,
    setGroupsInitialized,
  }: {
    setGroups: Function;
    setGroupsInitialized: Function;
  } = userStore;

  if (loggedUser.value && loggedUser.value.uid) {
    // if the state's already initialized, return from state
    if (groupsInitialized.value) {
      if (!status) return groups.value;
      else if (status) return groups.value.filter((g) => g.status === status);
    } else {
      // else get them from the db
      const userGroups: Array<WLUserGroup> = await fetchUserGroups(
        loggedUser.value.uid
      );

      if (userGroups) {
        // add them to state
        setGroups(userGroups);
        setGroupsInitialized(true);
      }

      if (!status) return userGroups;
      else return userGroups.filter((g) => g.status === status);
    }
  }
};
