export enum AuthTab {
  LOGIN = "Login",
  REGISTER = "Register",
}

export type EmailUserAuth = {
  email: string;
  password: string;
};

export type ExtendedEmailUserAuth = {
  email: string;
  password: string;
  birth_date: string;
  first_name: string;
  last_name: string;
};

export type WLUser = {
  uid: string | null;
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
};
