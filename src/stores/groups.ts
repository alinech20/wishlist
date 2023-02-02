import type { ActionCard } from "@/types/action-cards.types";
import { defineStore, storeToRefs } from "pinia";
import { markRaw, reactive, ref, type Ref } from "vue";

import {
  AddToGroupIcon,
  CreateGroupIcon,
  JoinGroupIcon,
  ManageGroupsIcon,
} from "@/components/ui/icons";
import {
  type WLGroup,
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/types/wishlist.types";

import { useFormStore } from "./form";
import { useUserStore } from "./user";

import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
  type DocumentData,
} from "@firebase/firestore";
import { db } from "@/helpers/firebase";
import type { QueryFieldFilterConstraint } from "firebase/firestore";
import { getNicelyFormattedCurrentDateTime } from "@/helpers/date";

export const useGroupsStore = defineStore("groups", () => {
  // #region Active view logic (groups subpage)
  const activeView = ref<string>("home");
  const setActiveView: Function = (v: string): string => (activeView.value = v);
  // #endregion

  // #region Action cards
  const groupsActions = reactive<Array<ActionCard>>([
    {
      icon: markRaw(CreateGroupIcon),
      name: "Create group",
      action: () => setActiveView("create"),
    },
    {
      icon: markRaw(JoinGroupIcon),
      name: "Join group",
      action: () => setActiveView("join"),
    },
    {
      icon: markRaw(AddToGroupIcon),
      name: "Invite",
      action: () => setActiveView("invite"),
    },
    {
      icon: markRaw(ManageGroupsIcon),
      name: "Manage groups",
      action: () => setActiveView("manage"),
    },
  ]);
  // #endregion

  // #region Importing some helpful stuff from the form store
  const formStore = useFormStore();

  const {
    setFormProcessingMessage,
    hideFormMessage,
    showFormMessage,
  }: {
    setFormProcessingMessage: Function;
    hideFormMessage: Function;
    showFormMessage: Function;
  } = formStore;
  // #endregion

  // #region Group actions
  /**
   * Fetches a group from the db by its id
   *
   * @param { string } id Id of the group
   */
  const getGroupById: Function = async (
    id: string
  ): Promise<DocumentData | undefined> => {
    try {
      showFormMessage("Searching for the group...");

      const groupRef: DocumentReference<DocumentData> = doc(db, "groups", id);
      const groupSnap: DocumentSnapshot<DocumentData> = await getDoc(groupRef);

      if (groupSnap.exists()) {
        hideFormMessage();
        return groupSnap.data();
      } else
        throw {
          code: "Group does not exist :(",
        };
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
      return undefined;
    }
  };

  /**
   * Checks if a user is in a certain group
   *
   * @param { string } uid The user's id
   * @param { string } gid The group's id
   *
   * Returns true or false depending if the user's in the group or not
   * Can also return undefined in case it errors
   */
  const isUserInGroup: Function = async (
    uid: string,
    gid: string
  ): Promise<boolean | undefined> => {
    try {
      const result: QuerySnapshot<DocumentData> = await getDocs(
        query(
          collection(db, "users_groups"),
          where("userId", "==", uid),
          where("groupId", "==", gid)
        )
      );

      if (result.size === 1) {
        setFormProcessingMessage({
          type: "error",
          message: "Already in the group",
        });

        hideFormMessage();

        return true;
      } else return false;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
    }
  };

  /**
   * Creates a new group
   *
   * @param { WLGroup } g Data for the group to be created
   *
   * Returns the id of the newly created group or null
   */
  const createGroup: Function = async (g: WLGroup): Promise<string | null> => {
    showFormMessage("Your group is being created...");

    try {
      const newGroup: DocumentReference<DocumentData> = await addDoc(
        collection(db, "groups"),
        g
      );

      setFormProcessingMessage({
        type: "success",
        message: "Group successfully created!",
      });

      hideFormMessage();
      return newGroup.id;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
      return null;
    }
  };

  /**
   * Adds a new group to the user store's state
   *
   * @param { any } data Has userId, groupId, joinedOn, admin properties
   */
  const pushGroupToUserStore: Function = async (data: any): Promise<void> => {
    const { groupsInitialized }: { groupsInitialized: Ref<boolean> } =
      storeToRefs(useUserStore());
    const { pushGroup }: { pushGroup: Function } = useUserStore();

    if (groupsInitialized) {
      const group: DocumentData | undefined = await getGroupById(data.groupId);

      if (group) {
        const groupToPush: WLUserGroup = {
          joinedOn: data.joinedOn,
          admin: data.admin,
          group: {
            id: data.groupId,
            createdOn: group.createdOn,
            createdBy: group.createdBy,
            name: group.name,
            budget: group.budget,
            event: group.event,
            date: group.date,
          } as WLGroup,
        };

        pushGroup(groupToPush);
      }
    }
  };

  /**
   * Adds a user to a group
   *
   * @param { Object } data Object with the data needed to add to db
   *
   * Returns true or false depending if the operation was successful or not
   */
  const addUserToGroup: Function = async (data: any): Promise<boolean> => {
    showFormMessage("Joining the group...");

    try {
      await addDoc(collection(db, "users_groups"), data);
      pushGroupToUserStore(data);

      setFormProcessingMessage({
        type: "success",
        message: "Successfully joined the group!",
      });

      hideFormMessage();

      return true;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
      return false;
    }
  };

  const fetchUserGroups: Function = async (
    uid: string,
    status: WLGroupMembershipStatus
  ): Promise<Array<WLUserGroup> | undefined> => {
    try {
      const whereClauses: Array<QueryFieldFilterConstraint> = [
        where("userId", "==", uid),
      ];

      if (status) whereClauses.push(where("status", "==", status));

      const groupRelations: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(db, "users_groups"), ...whereClauses)
      );

      const userGroups: Array<WLUserGroup> = [];

      await Promise.all(
        groupRelations?.docs.map(async (document) => {
          const docData: DocumentData = document.data();
          const group: DocumentSnapshot<DocumentData> = await getDoc(
            doc(db, "groups", docData.groupId)
          );

          const gData: DocumentData | undefined = group.data();

          const userGroup: WLUserGroup = {
            joinedOn: docData.joinedOn,
            admin: docData.admin,
            group: {
              id: docData.groupId,
              createdOn: gData?.createdOn,
              createdBy: gData?.createdBy,
              name: gData?.name,
              budget: gData?.budget,
              event: gData?.event,
              date: gData?.date,
            } as WLGroup,
          };

          userGroups.push(userGroup);
        })
      );

      return userGroups;
    } catch (e: any) {
      console.error(e);
    }
  };

  const inviteToGroup: Function = async (
    uid: string,
    gid: string
  ): Promise<void> => {
    try {
      showFormMessage("Inviting user(s)...");
      const { getUserData } = storeToRefs(useUserStore());

      const data = {
        requester: getUserData.value.user.uid,
        status: WLGroupMembershipStatus.INVITED,
        userId: uid,
        groupId: gid,
        admin: false,
        joinedOn: getNicelyFormattedCurrentDateTime(),
      };

      await addDoc(collection(db, "users_groups"), data);

      setFormProcessingMessage({
        type: "success",
        message: "Invitation sent!",
      });
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e,
      });

      hideFormMessage();
    }
  };
  // #endregion

  return {
    groupsActions,
    activeView,
    getGroupById,
    isUserInGroup,
    createGroup,
    addUserToGroup,
    fetchUserGroups,
    inviteToGroup,
  };
});
