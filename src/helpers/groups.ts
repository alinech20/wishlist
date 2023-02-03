import { useAuthStore } from "@/stores/auth";
import { useGroupsStore } from "@/stores/groups";
import { useUserStore } from "@/stores/user";
import type { WLUser } from "@/types/auth.types";
import type {
  WLGroupMembershipStatus,
  WLUserGroup,
} from "@/types/wishlist.types";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";

export const initializeStateGroups: Function = async (
  status?: WLGroupMembershipStatus
): Promise<Array<WLUserGroup> | undefined> => {
  const { groupsInitialized }: { groupsInitialized: Ref<boolean> } =
    storeToRefs(useUserStore());

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
  } = useUserStore();

  if (loggedUser.value && loggedUser.value.uid) {
    const userGroups: Array<WLUserGroup> = await fetchUserGroups(
      loggedUser.value.uid,
      status
    );

    if (userGroups && !groupsInitialized.value && !status) {
      setGroups(userGroups);
      setGroupsInitialized(true);
    }

    return userGroups;
  }
};
