import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
// import {
//   ifChrome
// } from "@/utils/setStorage";
// import {
//   getTab,
//   haveRequest
// } from "@/utils/popup";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('../views/welcome.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/Details',
    name: 'Details',
    component: () => import('../views/Details.vue'),
  },
  {
    path: '/Set',
    name: 'Set',
    component: () => import('../views/Set.vue'),
  },
  {
    path: '/Netlist',
    name: 'Netlist',
    component: () => import('../views/Netlist.vue'),
  },
  {
    path: '/Netdetail',
    name: 'Netdetail',
    component: () => import('../views/Netdetail.vue'),
  },
  {
    path: '/Addnet',
    name: 'Addnet',
    component: () => import('../views/Addnet.vue'),
  },
  {
    path: '/Pluglist',
    name: 'Pluglist',
    component: () => import('../views/Pluglist.vue'),
  },
  {
    path: '/Search',
    name: 'Search',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/Transfer',
    name: 'Transfer',
    component: () => import('../views/Transfer.vue'),
  },
  {
    path: '/NftDetail',
    name: 'NftDetail',
    component: () => import('../views/NftDetail.vue'),
  },
  {
    path: '/SetPassword',
    name: 'SetPassword',
    component: () => import('../views/SetPassword.vue'),
  },
  {
    path: '/pwdLogin',
    name: 'pwdLogin',
    component: () => import('../views/pwdLogin.vue'),
  },
  {
    path: '/languageSwitch',
    name: 'languageSwitch',
    component: () => import('../views/languageSwitch.vue'),
  },
  {
    path: '/connect',
    name: 'connect',
    component: () => import('../views/connect.vue'),
  },
  {
    path: '/connectList',
    name: 'connectList',
    component: () => import('../views/connectList.vue'),
  },
  {
    path: '/signconnect',
    name: 'signconnect',
    component: () => import('../views/sign_connect.vue'),
  },
  {
    path: '/encrypt',
    name: 'encrypt',
    component: () => import('../views/encrypt_connect.vue'),
  },
  {
    path: '/decrypt',
    name: 'decrypt',
    component: () => import('../views/decrypt_connect.vue'),
  },
  {
    path: '/social',
    name: 'social',
    component: () => import('../views/social_connect.vue'),
  },
  {
    path: '/setrsa',
    name: 'setrsa',
    component: () => import('../views/setRsa.vue'),
  },
  {
    path: '/setWhiteList',
    name: 'setWhiteList',
    component: () => import('../views/setWhiteList.vue'),
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})
// router.beforeEach((to, from, next) => {
//   // return next()
//   if (to.path === '/login' || to.path === '/connect') return next()
//   let acc = JSON.parse(localStorage.getItem("currentAccont"));
//   if (!ifChrome() || !acc) {
//     next();
//   } else {
//     let connectList = JSON.parse(localStorage.getItem("connectList"))
//     if (!connectList || connectList.length == 0) {
//       next({
//         name: 'connect',
//       });
//     } else {
//       getTab().then(res => {
//         let ifFast = connectList.find(item => {
//           return item.url == res.url
//         })
//         if (ifFast) {
//           next();
//         } else {
//           next({
//             name: 'connect',
//           });
//         }
//       })
//     }
//     next();
//   }
// })

export default router
