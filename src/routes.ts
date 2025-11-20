import { createRouter, createWebHistory } from "vue-router";
//import { useAuthStore } from "./stores/authStore";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/Home.vue"),
    //meta: { requiresAuth: true },
  },
/*   { path: "/", name: "Login", component: () => import("./views/Login.vue") },
  { path: "/register", name: "Register", component: () => import("./views/Register.vue") }, */
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./views/NotFound.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");
  const isAuth = await authStore.isAuthenticated(token);

  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' });
  } else {
    next();
  }
});
 */