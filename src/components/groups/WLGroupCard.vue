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

import type { WLButton } from "@/types/forms.types";
import {
  WLGroupMembershipStatus,
  type WLUserGroup,
} from "@/types/wishlist.types";

import WLBaseButton from "@/components/ui/WLBaseButton.vue";
import { useGroupsStore } from "@/stores/groups";

import { CancelIcon, OKIcon } from "@/components/ui/icons";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import type { WLUser } from "@/types/auth.types";

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

const groupActions: Function = (): Array<WLButton> | undefined => {
  switch (props.status) {
    case WLGroupMembershipStatus.INVITED:
      return invitationActions;
    default:
      return;
  }
};
</script>

<style lang="scss">
@use "@/assets/styles/components/groups/wl-group-card.scss";
</style>
