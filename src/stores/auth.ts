import type {
  EmailUserAuth,
  ExtendedEmailUserAuth,
  WLUser,
} from "@/types/auth.types";
import type { WLForm, WLField, WLButton } from "@/types/forms.types";
import { useFormStore } from "./form";

import { auth, db } from "@/helpers/firebase";
import { doc, getDoc, setDoc, type DocumentData } from "@firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
} from "@firebase/auth";

import { defineStore, storeToRefs } from "pinia";
import { reactive, type Ref } from "vue";
import {
  type QuerySnapshot,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";

export const useAuthStore = defineStore("auth", () => {
  // #region Form submission status and possible message
  const formStore = useFormStore();

  const {
    formProcessing,
  }: {
    formProcessing: Ref<boolean>;
  } = storeToRefs(formStore);

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

  // #region Login form
  const loginForm: WLForm = reactive({
    id: "LoginForm",
    title: "Login",
    validationSchema: {
      // login fields
      email: "required|email|min:5|max:60",
      password: "required|min:6|max:32",
    },
    fields: [
      // login fields
      {
        key: "email",
        type: "email",
        name: "email",
        required: true,
        placeholder: "Email...",
      } as WLField,
      {
        key: "password",
        type: "password",
        name: "password",
        required: true,
        placeholder: "Password...",
      } as WLField,
    ] as Array<WLField>,
    buttons: [
      {
        key: "login-button",
        form: "LoginForm",
        name: "login",
        type: "submit",
        text: "Login",
        xClasses: "wl-button--primary",
        disabled: formProcessing,
      } as WLButton,
    ] as Array<WLButton>,
  });
  // #endregion

  // #region Register form
  const registerForm: WLForm = reactive({
    id: "RegisterForm",
    title: "Register",
    validationSchema: {
      // register fields
      first_name: "required|min:2|max:32|alpha",
      last_name: "required|min:2|max:32|alpha",
      birthdate: {
        regexDate: /^((1[3-9]|20)\d{2})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/,
      },
      email: "required|email|min:5|max:60",
      password: {
        required: true,
        regexPassword:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{8,}$/,
      },
      confirm_password: "confirmed:@password",
    },
    fields: [
      // register fields
      {
        key: "firstname",
        type: "text",
        name: "first_name",
        required: true,
        placeholder: "First name...",
      } as WLField,
      {
        key: "lastname",
        type: "text",
        name: "last_name",
        required: true,
        placeholder: "Last name...",
      } as WLField,
      {
        key: "birthdate",
        type: "date",
        name: "birth_date",
        placeholder: "Birth date...",
      } as WLField,
      {
        key: "email",
        type: "email",
        name: "email",
        required: true,
        placeholder: "Email...",
      } as WLField,
      {
        key: "password",
        type: "password",
        name: "password",
        required: true,
        placeholder: "Password...",
      } as WLField,
      {
        key: "confirm-password",
        type: "password",
        name: "confirm_password",
        required: true,
        placeholder: "Repeat password...",
      } as WLField,
    ] as Array<WLField>,
    buttons: [
      {
        key: "register-button",
        form: "RegisterForm",
        name: "register",
        type: "submit",
        text: "Register",
        xClasses: "wl-button--primary",
        disabled: formProcessing,
      } as WLButton,
    ] as Array<WLButton>,
  });
  // #endregion

  // #region Auth form getter
  /**
   * Gets the active form that should be rendered
   *
   * @param { string } f Name of the form to be rendered
   *
   * Returns a form object
   */
  const getForm: Function = (f: string): WLForm | null => {
    switch (f) {
      case "login":
        return loginForm;
      case "register":
        return registerForm;
      default:
        return null;
    }
  };
  // #endregion

  // #region Handlers for register/login by email + password
  /**
   * Creates a new account and logs the user in if successfully registered
   *
   * @param { ExtendedEmailUserAuth } u An auth user object with email and password
   * @param { Function } cb Callback function
   */
  const handleEmailRegister: Function = async (
    u: ExtendedEmailUserAuth,
    cb: Function
  ) => {
    showFormMessage("Your account is being registered...");

    try {
      const userCredentials: UserCredential =
        await createUserWithEmailAndPassword(auth, u.email, u.password);

      await setDoc(doc(db, "users", userCredentials.user.uid), {
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        birthdate: u.birth_date,
      });

      setFormProcessingMessage({
        type: "success",
        message: "Account successfully registered!",
      });

      cb && cb();
    } catch (e: any) {
      let msg: string | null = null;

      switch (e.code) {
        case "auth/email-already-in-use":
          msg = "This email is already in use!";
          break;
        default:
          msg = e.code;
          break;
      }

      setFormProcessingMessage({
        type: "error",
        message: msg,
      });
    } finally {
      hideFormMessage();
    }
  };

  /**
   * Logs in the user with email and password
   *
   * @param { EmailUserAuth } u An auth user object with email and password
   * @param { Function } cb Callback function
   */
  const handleEmailLogin: Function = async (u: EmailUserAuth, cb: Function) => {
    showFormMessage("You are being logged in...");

    try {
      await signInWithEmailAndPassword(auth, u.email, u.password);

      setFormProcessingMessage({
        type: "success",
        message: "Successfully logged in!",
      });

      cb && cb();
    } catch (e: any) {
      let msg: string | null = null;

      switch (e.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          msg = "Incorrect login details";
          break;
        default:
          msg = e.code;
          break;
      }

      setFormProcessingMessage({
        type: "error",
        message: msg,
      });
    } finally {
      hideFormMessage();
    }
  };

  const handleSignOut: Function = async () => {
    await auth.signOut();
  };
  // #endregion

  // #region Set the logged user info on login
  const loggedUser = reactive<WLUser>({
    uid: null,
    firstName: "",
    lastName: "",
    birthdate: "",
    email: "",
  });

  /**
   * Sets the value for the logged user
   *
   * @param { WLUser } user The user with all the properties needed
   * to be set for the logged user
   */
  const setLoggedUser: Function = (user: WLUser): void => {
    loggedUser.uid = user.uid;
    loggedUser.firstName = user.firstName;
    loggedUser.lastName = user.lastName;
    loggedUser.birthdate = user.birthdate;
    loggedUser.email = user.email;
  };
  // #endregion

  // #region Some fetch methods for users
  /**
   * Fetches a user from the db based on their id
   *
   * @param { string } uid The user id from the db
   */
  const getUserById: Function = async (
    uid: string
  ): Promise<DocumentData | undefined> => {
    const user = await getDoc(doc(db, "users", uid));
    return user.data();
  };

  const getUserByEmail: Function = async (
    email: string
  ): Promise<DocumentData | undefined> => {
    try {
      const user: QuerySnapshot<DocumentData> = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (user.size === 1)
        return {
          userId: user.docs[0].id,
          ...user.docs[0].data(),
        };
      else {
        setFormProcessingMessage({
          type: "error",
          message: "User does not exist",
        });

        hideFormMessage();
      }
    } catch (e: any) {
      setFormProcessingMessage({
        type: "error",
        message: e.message,
      });

      hideFormMessage();
    }
  };
  // #endregion

  return {
    getForm,
    loginForm,
    handleEmailRegister,
    handleEmailLogin,
    handleSignOut,
    getUserById,
    getUserByEmail,
    setLoggedUser,
    loggedUser,
  };
});
