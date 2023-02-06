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

  // TODO: if groups are initialized, return the state groups instead
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
