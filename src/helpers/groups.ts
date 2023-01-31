import { useAuthStore } from "@/stores/auth";
import { useGroupsStore } from "@/stores/groups";
import { useUserStore } from "@/stores/user";
import type { WLUser } from "@/types/auth.types";
import type { WLGroupMembershipStatus } from "@/types/wishlist.types";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";

export const initializeStateGroups: Function = async (
  status: WLGroupMembershipStatus
) => {
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

  if (loggedUser.value && loggedUser.value.uid && !groupsInitialized.value) {
    const userGroups = await fetchUserGroups(loggedUser.value.uid, status);
    setGroups(userGroups);
    setGroupsInitialized(true);
  }
};
