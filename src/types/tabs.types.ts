import type { ComputedRef } from "vue";

export type Tab = {
  name: string;
  location: string;
  active: boolean | ComputedRef<boolean>;
  onClick: Function;
};

export type TabCollection = {
  title: string;
  tabs: Array<Tab>;
};
