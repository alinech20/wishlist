<template>
  <WLActionCardList :action-cards="groupsActions"></WLActionCardList>
</template>

<script setup lang="ts">
import { markRaw } from "vue";
import { useRouter } from "vue-router";

import type { ActionCard } from "@/types/action-cards.types";
import WLActionCardList from "@/components/WLActionCardList.vue";

import {
  AddToGroupIcon,
  CreateGroupIcon,
  JoinGroupIcon,
  ManageIcon,
} from "@/components/ui/icons";

const router = useRouter();

const groupsActions: Array<ActionCard> = [
  {
    icon: markRaw(CreateGroupIcon),
    name: "Create group",
    action: () => router.push({ name: "Create Group" }),
  },
  {
    icon: markRaw(JoinGroupIcon),
    name: "Join group",
    action: () => router.push({ name: "Join Group" }),
  },
  {
    icon: markRaw(AddToGroupIcon),
    name: "Invite",
    action: () => router.push({ name: "Invite to Group" }),
  },
  {
    icon: markRaw(ManageIcon),
    name: "Manage groups",
    action: () => router.push({ name: "Manage Groups" }),
  },
];
</script>
