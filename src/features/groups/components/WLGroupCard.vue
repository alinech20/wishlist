<template>
  <article class="wl-card wl-group-card">
    <section class="group-card__name">
      <h2 class="heading heading--xs">{{ props.group.name }}</h2>
    </section>
    <section class="group-card__details">
      <section class="group-card__info">
        <p class="paragraph paragraph--s">
          Budget:
          <strong>{{
            props.group.budget ? props.group.budget : "not set"
          }}</strong>
        </p>
      </section>
      <section class="group-card__footer">
        <p class="paragraph paragraph--s">
          Deadline:
          <strong>{{ props.group.date }}</strong>
        </p>
      </section>
    </section>
    <section class="group-card__actions">
      <WLBaseButton
        v-for="button in groupActions()"
        :key="button.key"
        v-bind="button"
      ></WLBaseButton>
    </section>
  </article>
</template>

<script setup lang="ts">
import { markRaw, type Ref } from "vue";
import { storeToRefs } from "pinia";

import type { WLButton } from "@/types/forms.types";
import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/features/groups/types";

import WLBaseButton from "@/components/ui/WLBaseButton.vue";
import { useGroupsStore } from "@/features/groups/store";

import { CancelIcon, OKIcon } from "@/components/ui/icons";
import { useAuthStore } from "@/features/auth/store";
import type { WLUser } from "@/features/auth/types";

const props: WLUserGroup = defineProps<{
  joinedOn: string;
  admin: boolean;
  status: WLGroupMembershipStatus;
  group: {
    id?: string;
    name: string;
    event?: string;
    date?: string;
    budget?: number;
    createdBy: string;
    createdOn?: string;
    modifiedOn?: string;
  };
}>();

const handleInvite: Function = async (v: boolean): Promise<void> => {
  const status: WLGroupMembershipStatus = v
    ? WLGroupMembershipStatus.ACCEPTED
    : WLGroupMembershipStatus.DECLINED;

  const { updateUserGroupRelation }: { updateUserGroupRelation: Function } =
    useGroupsStore();
  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  return await updateUserGroupRelation(
    status,
    loggedUser.value.uid,
    props.group.id
  );
};

const cancelRequest: Function = async (): Promise<void> => {
  const { updateUserGroupRelation }: { updateUserGroupRelation: Function } =
    useGroupsStore();
  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  return await updateUserGroupRelation(
    null,
    loggedUser.value.uid,
    props.group.id
  );
};

const invitationActions: Array<WLButton> = [
  {
    key: "decline",
    name: "decline",
    type: "button",
    text: "",
    icon: markRaw(CancelIcon),
    xClasses: "wl-button--round wl-button--xs wl-button--secondary-dark",
    buttonClick: handleInvite,
    clickParams: [false],
  } as WLButton,
  {
    key: "accept",
    name: "accept",
    type: "button",
    text: "",
    icon: markRaw(OKIcon),
    xClasses: "wl-button--round wl-button--xs wl-button--primary",
    buttonClick: handleInvite,
    clickParams: [true],
  } as WLButton,
];

const requestsActions: Array<WLButton> = [
  {
    key: "cancel",
    name: "cancel",
    type: "button",
    text: "",
    icon: markRaw(CancelIcon),
    xClasses: "wl-button--round wl-button--xs wl-button--secondary-dark",
    buttonClick: cancelRequest,
  },
];

const groupActions: Function = (): Array<WLButton> | undefined => {
  switch (props.status) {
    case WLGroupMembershipStatus.INVITED:
      return invitationActions;
    case WLGroupMembershipStatus.REQUESTED:
      return requestsActions;
    default:
      return;
  }
};
</script>

<style lang="scss">
@use "@/features/groups/assets/styles/wl-group-card.scss";
</style>
