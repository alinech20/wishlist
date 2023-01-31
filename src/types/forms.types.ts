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
};

export type WLButton = {
  key: string;
  name: string;
  type?: "button" | "reset" | "submit" | undefined;
  text: string;
  form?: string;
  icon?: string;
  xClasses?: string;
  buttonClick?: Function;
  clickParams?: Array<any>;
};

export type WLDropdownOption = {
  value: string;
  displayName: string;
};

export type WLFormSubmissionMessage = {
  type: "success" | "pending" | "error" | undefined;
  message: string;
};

export type WLForm = {
  id?: string;
  title: string;
  validationSchema: Object;
  fields: Array<WLField>;
  buttons: Array<WLButton>;
};
