import { defineStore, storeToRefs } from "pinia";
import type { Ref } from "vue";

import {
  type WLGroup,
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/features/groups/types";

import { useFormStore } from "@/stores/form";
import { useUserStore } from "@/stores/user";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
  type DocumentData,
} from "@firebase/firestore";
import { db } from "@/helpers/firebase";
import type { QueryFieldFilterConstraint } from "firebase/firestore";
import { getNicelyFormattedCurrentDateTime } from "@/helpers/date";

export const useGroupsStore = defineStore("groups", () => {
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
   * @returns { DocumentData | undefined } Group entry
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
    }
  };

  /**
   * Checks if a user is in a certain group
   *
   * @param { string } uid The user's id
   * @param { string } gid The group's id
   * @returns { boolean | undefined } True or false depending if the user's in the group or not
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
   * @returns { string | null } The id of the newly created group or null
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
          status: data.status,
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
   * @returns { boolean } True or false depending if the operation was successful or not
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

  /**
   * Gets the groups the user's a member of
   *
   * @param { string } uid User id
   * @param { string } status Membership status (used to filter the groups)
   * @returns { Promise<Array<WLUserGroup>> } Array of groups
   */
  const fetchUserGroups: Function = async (
    uid: string,
    status?: WLGroupMembershipStatus
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
            status: docData.status,
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

  /**
   * Invites a user to join a group
   *
   * @param { string } uid User id
   * @param { string } gid Group id
   */
  const inviteToGroup: Function = async (
    uid: string,
    gid: string,
    status?: WLGroupMembershipStatus
  ): Promise<void> => {
    try {
      showFormMessage("Inviting user(s)...");
      const { getUserData } = storeToRefs(useUserStore());

      const data = {
        requester: getUserData.value.user.uid,
        status: status || WLGroupMembershipStatus.INVITED,
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

  /**
   * Fetches a reference from the users_groups collection based on uid and gid
   *
   * @param { string } uid User's id
   * @param { string } gid Group's id
   * @returns { DocumentReference } Matching document
   */
  const fetchUserGroupRelation: Function = async (
    uid: string,
    gid: string
  ): Promise<DocumentReference | undefined> => {
    try {
      const whereClauses: Array<QueryFieldFilterConstraint> = [
        where("userId", "==", uid),
        where("groupId", "==", gid),
      ];

      const ugRelation: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(db, "users_groups"), ...whereClauses)
      );

      if (ugRelation.size === 1) return ugRelation.docs[0].ref;
    } catch (e: any) {
      console.error(e);
    }
  };

  /**
   * Updates relation with a group in the local state
   *
   * @param { string } gid Group's id
   * @param { WLGroupMembershipStatus } status New status
   */
  const updateStateGroupStatus: Function = (
    gid: string,
    status: WLGroupMembershipStatus
  ): void => {
    const { updateGroupStatus }: { updateGroupStatus: Function } =
      useUserStore();

    updateGroupStatus(gid, status);
  };

  /**
   * Updates a user's relation status with a group
   *
   * @param { WLGroupMembershipStatus } status The new status
   * @param { string } uid User's id
   * @param { string } gid Group's id
   */
  const updateUserGroupRelation: Function = async (
    status: WLGroupMembershipStatus,
    uid: string,
    gid: string
  ): Promise<void> => {
    try {
      const docToUpdate = await fetchUserGroupRelation(uid, gid);
      if (docToUpdate) {
        if (!status) {
          return await deleteDoc(docToUpdate);
        } else {
          updateStateGroupStatus(gid, status);

          return await updateDoc(docToUpdate, {
            status: status,
          });
        }
      }
    } catch (e: any) {
      console.error(e);
    }
  };
  // #endregion

  return {
    getGroupById,
    isUserInGroup,
    createGroup,
    addUserToGroup,
    fetchUserGroups,
    inviteToGroup,
    updateUserGroupRelation,
  };
});
