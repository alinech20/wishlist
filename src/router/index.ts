import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/helpers/firebase";

import AuthView from "@/features/auth/views/WLAuth.vue";
import DashboardView from "@/views/WLDashboard.vue";

import GroupsView from "@/features/groups/views/WLGroups.vue";
import GroupsDashboardView from "@/features/groups/views/partials/WLGroupsDashboard.vue";
import GroupsCreateView from "@/features/groups/views/partials/WLCreateGroup.vue";
import GroupsInviteView from "@/features/groups/views/partials/WLInvite.vue";
import GroupsJoinView from "@/features/groups/views/partials/WLJoinGroup.vue";
import GroupsManageView from "@/features/groups/views/partials/WLManageGroups.vue";

import WishlistView from "@/features/wishlist/views/WLWishlist.vue";
import WishlistDashboardView from "@/features/wishlist/views/partials/WLWishlistDashboard.vue";
import WishlistCreateView from "@/features/wishlist/views/partials/WLWishlistCreate.vue";
import WishlistAddItemView from "@/features/wishlist/views/partials/WLWishlistAddItem.vue";
import WishlistShareView from "@/features/wishlist/views/partials/WLWishlistShare.vue";
import WishlistManageView from "@/features/wishlist/views/partials/WLWishlistManage.vue";

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
      path: "/wishlists",
      name: "Wishlists",
      component: WishlistView,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "Wishlists Dashboard",
          component: WishlistDashboardView,
        },
        {
          path: "create",
          name: "Create Wishlist",
          component: WishlistCreateView,
        },
        {
          path: "add-item/:id",
          name: "Add Item",
          component: WishlistAddItemView,
        },
        {
          path: "share",
          name: "Share Wishlist",
          component: WishlistShareView,
        },
        {
          path: "manage",
          name: "Manage Wishlists",
          component: WishlistManageView,
        },
      ],
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
