import type { ActionCard } from "@/types/action-cards.types";
import { defineStore, storeToRefs } from "pinia";
import { markRaw, reactive, ref, type Ref } from "vue";

import {
  CreateGroupIcon,
  JoinGroupIcon,
  ManageGroupsIcon,
} from "@/components/ui/icons";
import type { WLGroup, WLUserGroup } from "@/types/wishlist.types";

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
        hideFormMessage(8000);
        return groupSnap.data();
      } else
        throw {
          code: "Group does not exist :(",
        };
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e.code,
      });

      hideFormMessage(8000);
      return undefined;
    }
  };

  const isUserInGroup: Function = async (
    uid: string,
    gid: string
  ): Promise<boolean | undefined> => {
    try {
      const result: QuerySnapshot<DocumentData> = await getDocs(
        query(
          collection(db, "users_groups"),
          where("userId", "==", uid),
          where("groupdId", "==", gid)
        )
      );

      if (result.size === 1) {
        setFormProcessingMessage({
          type: "error",
          message: "You are already part of the group",
        });

        hideFormMessage(8000);

        return true;
      } else return false;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e.code,
      });

      hideFormMessage(8000);
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

      hideFormMessage(8000);
      return newGroup.id;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e.code,
      });

      hideFormMessage(8000);
      return null;
    }
  };

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

      hideFormMessage(8000);

      return true;
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e.code,
      });

      hideFormMessage(8000);
      return false;
    }
  };

  const fetchUserGroups: Function = async (
    uid: string
  ): Promise<Array<WLUserGroup> | undefined> => {
    try {
      const groupRelations: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(db, "users_groups"), where("userId", "==", uid))
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
      console.error(e.code);
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
  };
});
