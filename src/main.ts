import { createApp, type App } from "vue";
import { createPinia } from "pinia";

import WishlistApp from "./App.vue";
import router from "./router";
import { veeValidatePlugin } from "@/helpers/validators";

import { auth } from "@/helpers/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useAuthStore } from "./stores/auth";

let app: App<Element> | null = null;

onAuthStateChanged(auth, async (user) => {
  if (!app) {
    app = createApp(WishlistApp);

    app.use(createPinia());

    const {
      getUserById,
      setLoggedUser,
    }: { getUserById: Function; setLoggedUser: Function } = useAuthStore();

    if (user) {
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

    app.use(router);
    app.use(veeValidatePlugin);

    app.mount("#app");
  }
});
