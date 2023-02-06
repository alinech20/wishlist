import { createApp, type App, type Ref } from "vue";
import { createPinia, storeToRefs } from "pinia";

import WishlistApp from "./App.vue";
import router from "./router";
import { veeValidatePlugin } from "@/helpers/validators";

import { auth } from "@/helpers/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useAuthStore } from "@/features/auth/store";
import type { WLUser } from "@/features/auth/types";

let app: App<Element> | null = null;

onAuthStateChanged(auth, async (user) => {
  let haveToInitializeApp: boolean = false;

  if (!app) {
    app = createApp(WishlistApp);
    app.use(createPinia());

    haveToInitializeApp = true;
  }

  const {
    getUserById,
    setLoggedUser,
  }: {
    getUserById: Function;
    setLoggedUser: Function;
  } = useAuthStore();

  const { loggedUser }: { loggedUser: Ref<WLUser> } = storeToRefs(
    useAuthStore()
  );

  if (user && !loggedUser.value.uid) {
    const userData = await getUserById(user.uid);
    setLoggedUser({ uid: user.uid, ...userData });
  } else {
    setLoggedUser({
      uid: null,
      firstName: "",
      lastName: "",
      birthdate: "",
      email: "",
    });
  }

  if (haveToInitializeApp) {
    app.use(router);
    app.use(veeValidatePlugin);

    app.mount("#app");
  }
});
