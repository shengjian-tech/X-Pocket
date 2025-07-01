import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('../views/welcome.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
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
    path: '/invokecontract',
    name: 'invokecontract',
    component: () => import('../views/invoke_contract.vue'),
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

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router