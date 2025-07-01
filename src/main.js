
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import buffer from 'buffer';
import { createI18n } from 'vue-i18n'

// 设置全局的 crypto 和 Buffer
window.Buffer = buffer.Buffer

// 国际化中英文切换
const i18n = createI18n({
  locale: localStorage.getItem('languageSet') || 'zh', // 从 localStorage 里获取用户中英文选择，没有则默认中文
  messages: {
    zh: require('./components/Language/zh'),
    en: require('./components/Language/en'),
  },
})

const app = createApp(App)

// 全局挂载 axios
app.config.globalProperties.$axios = axios

// 使用路由和国际化插件
app.use(router)
app.use(i18n)

// 挂载应用
app.mount('#app')

export { i18n };