import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/helpers/firebase";

import AuthView from "@/views/WLAuth.vue";
import DashboardView from "@/views/WLDashboard.vue";
import GroupsView from "@/groups/views/WLGroups.vue";
import GroupsDashboardView from "@/groups/views/partials/WLGroupsDashboard.vue";
import GroupsCreateView from "@/groups/views/partials/WLCreateGroup.vue";
import GroupsInviteView from "@/groups/views/partials/WLInvite.vue";
import GroupsJoinView from "@/groups/views/partials/WLJoinGroup.vue";
import GroupsManageView from "@/groups/views/partials/WLManageGroups.vue";
import WishlistView from "@/views/WLWishlist.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      name: "Authentication",
      component: AuthView,
    },
    {
      path: "/",
      name: "Dashboard",
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/groups",
      name: "Groups",
      component: GroupsView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "Groups Dashboard",
          component: GroupsDashboardView,
        },
        {
          path: "create",
          name: "Create Group",
          component: GroupsCreateView,
        },
        {
          path: "join",
          name: "Join Group",
          component: GroupsJoinView,
        },
        {
          path: "invite",
          name: "Invite to Group",
          component: GroupsInviteView,
        },
        {
          path: "manage",
          name: "Manage Groups",
          component: GroupsManageView,
        },
      ],
    },
    {
      path: "/wishlist",
      name: "Wishlist",
      component: WishlistView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)*",
      redirect: { name: "Dashboard" },
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;

  if (to.meta.requiresAuth && !currentUser)
    return next({ name: "Authentication" });
  else if (to.name === "Authentication" && currentUser) {
    return next({ name: "Dashboard" });
  } else return next();
});

export default router;
