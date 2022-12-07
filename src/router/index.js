import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Home",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/Details",
    name: "Details",
    component: () => import("../views/Details.vue"),
  },
  {
    path: "/Set",
    name: "Set",
    component: () => import("../views/Set.vue"),
  },
  {
    path: "/Netlist",
    name: "Netlist",
    component: () => import("../views/Netlist.vue"),
  },
  {
    path: "/Netdetail",
    name: "Netdetail",
    component: () => import("../views/Netdetail.vue"),
  },
  {
    path: "/Addnet",
    name: "Addnet",
    component: () => import("../views/Addnet.vue"),
  },
  {
    path: "/Pluglist",
    name: "Pluglist",
    component: () => import("../views/Pluglist.vue"),
  },
  {
    path: "/Search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "/Transfer",
    name: "Transfer",
    component: () => import("../views/Transfer.vue"),
  },
  {
    path: "/NftDetail",
    name: "NftDetail",
    component: () => import("../views/NftDetail.vue"),
  },
  {
    path: "/SetPassword",
    name: "SetPassword",
    component: () => import("../views/SetPassword.vue"),
  },
  {
    path: "/pwdLogin",
    name: "pwdLogin",
    component: () => import("../views/pwdLogin.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
