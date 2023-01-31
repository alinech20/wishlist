import type { Component } from "vue";

export type ActionCard = {
  icon: Component;
  name: string;
  action: Function;
  backgroundColor?: string;
  textColor?: string;
};
