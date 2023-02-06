import type { Component, ComputedRef } from "vue";

export type WLDropdownOption = {
  optionValue: string;
  displayName: string;
};

export type WLField = {
  key: string;
  labelText?: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder: string;
  autocomplete?: string;
  hidden?: string;
  value?: string;
  fieldElement?: string;
  options?: Array<WLDropdownOption> | ComputedRef<Array<WLDropdownOption>>;
};

export type WLButton = {
  key: string;
  name: string;
  type?: "button" | "reset" | "submit" | undefined;
  text: string;
  form?: string;
  icon?: Component;
  xClasses?: string;
  buttonClick?: Function;
  clickParams?: Array<any>;
};

export type WLFormSubmissionMessage = {
  type: "success" | "pending" | "error" | undefined;
  message: string;
};

export type WLForm = {
  id?: string;
  title: string;
  additionalInfo?: string;
  validationSchema: Object;
  fields: Array<WLField>;
  buttons: Array<WLButton>;
};
